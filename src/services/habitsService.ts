import { db } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import type { Habit } from '../types'

const COLLECTION_NAME = 'habits'

const isTest = (typeof process !== 'undefined' && (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test')) ||
               (typeof window !== 'undefined' && typeof (window as any).Cypress !== 'undefined' && (window as any).Cypress === true)
const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : true

const memory = new Map<string, string>()
const habitsKey = (userId: string) => `motify_habits_${userId}`

function getStorage() {
  return (typeof window !== 'undefined' ? (window as any).localStorage : null) as Storage | null
}

function readHabitsLocal(userId: string): Habit[] {
  if (!userId) return []
  const key = habitsKey(userId)
  const storage = getStorage()
  const raw = storage ? storage.getItem(key) : memory.get(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Habit[]
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item })) : []
  } catch {
    return []
  }
}

function writeHabitsLocal(userId: string, data: Habit[]): Habit[] {
  if (!userId) return []
  const key = habitsKey(userId)
  const payload = JSON.stringify(data)
  const storage = getStorage()
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
  return data
}

const localHabitsService = {
  async getHabits(userId: string): Promise<Habit[]> {
    return readHabitsLocal(userId)
  },

  async addHabit(habit: Omit<Habit, 'id' | 'createdAt'> & { userId: string }): Promise<Habit> {
    const list = readHabitsLocal(habit.userId)
    const next: Habit = {
      ...habit,
      id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: habit.completed ?? false,
      streak: habit.streak ?? 0,
      datesCompleted: [...(habit.datesCompleted ?? [])],
    }
    writeHabitsLocal(habit.userId, [next, ...list])
    return next
  },

  async updateHabit(id: string, data: Partial<Habit> & { userId: string }): Promise<Habit> {
    const list = readHabitsLocal(data.userId)
    let found: Habit | null = null
    const updated = list.map((item) => {
      if (item.id !== id) return item
      const next: Habit = {
        ...item,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      found = next
      return next
    })
    if (!found) throw new Error('Habit not found')
    writeHabitsLocal(data.userId, updated)
    return found
  },

  async deleteHabit(id: string, userId: string): Promise<void> {
    const list = readHabitsLocal(userId)
    writeHabitsLocal(userId, list.filter((item) => item.id !== id))
  },

  async checkInHabit(id: string, date: string, userId: string): Promise<Habit> {
    const list = readHabitsLocal(userId)
    let updatedHabit: Habit | null = null

    const updated = list.map((item) => {
      if (item.id !== id) return item

      const dates = new Set(item.datesCompleted ?? [])
      const hadDate = dates.has(date)

      if (!hadDate) {
        dates.add(date)
      }

      const datesArray = Array.from(dates)
      const newHabit: Habit = {
        ...item,
        datesCompleted: datesArray,
        completed: dates.has(date),
        updatedAt: new Date().toISOString(),
        streak: hadDate ? (item.streak ?? 0) : (item.streak ?? 0) + 1,
      }

      updatedHabit = newHabit
      return newHabit
    })

    writeHabitsLocal(userId, updated)
    if (!updatedHabit) throw new Error('Habit not found')
    return updatedHabit
  },
}

function toDateKey(v: any): string {
  if (!v && v !== 0) return String(v)
  try {
    if (typeof v === 'object' && typeof (v as any).toDate === 'function') {
      return (v as any).toDate().toISOString().split('T')[0]
    }
    if (v instanceof Date) return v.toISOString().split('T')[0]
    if (typeof v === 'string') return v.split('T')[0]
    return String(v)
  } catch (e) {
    return String(v)
  }
}

const remoteHabitsService = {
  async getHabits(userId: string): Promise<Habit[]> {
    if (!userId) return []
    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId))
      const snapshot = await getDocs(q)
      const result = snapshot.docs.map(doc => {
        const data = doc.data() as any
        const dates = Array.isArray(data.datesCompleted) ? data.datesCompleted.map(toDateKey) : []
        const completed = (typeof data.completed === 'boolean') ? data.completed : dates.length > 0
        return ({ id: doc.id, ...data, datesCompleted: dates, completed } as Habit)
      })
      try { writeHabitsLocal(userId, result) } catch (e) { /* ignore */ }
      return result
    } catch (error) {
      console.error('Error fetching habits from Firestore, falling back to local:', error)
      return await localHabitsService.getHabits(userId)
    }
  },

  async addHabit(habit: Omit<Habit, 'id' | 'createdAt'> & { userId: string }): Promise<Habit> {
    const newHabit = {
      ...habit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: habit.completed ?? false,
      streak: habit.streak ?? 0,
      datesCompleted: habit.datesCompleted ?? [],
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newHabit)
    return { ...newHabit, id: docRef.id }
  },

  async updateHabit(id: string, data: Partial<Habit> & { userId: string }): Promise<Habit> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    }
    const { id: _, ...cleanData } = updateData as any

    try {
      console.log(`[remoteHabitsService] Updating habit ${id} with`, cleanData)
      await updateDoc(docRef, cleanData)
      const snap = await getDoc(docRef)
      if (!snap.exists()) throw new Error('Habit not found after update')
      console.log(`[remoteHabitsService] Habit ${id} updated successfully`)
      const sdata = snap.data() as any
      const sdates = Array.isArray(sdata.datesCompleted) ? sdata.datesCompleted.map(toDateKey) : []
      const scompleted = (typeof sdata.completed === 'boolean') ? sdata.completed : sdates.length > 0
      return { id: snap.id, ...sdata, datesCompleted: sdates, completed: scompleted } as Habit
    } catch (err: any) {
      console.error(`[remoteHabitsService] Failed to update habit ${id}:`, err)
      const msg = String(err?.code || err?.message || err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        console.warn('[remoteHabitsService] Permission error — falling back to local update')
        try {
          const localUpdated = await localHabitsService.updateHabit(id, data)
          return localUpdated
        } catch (le) {
          console.error('[remoteHabitsService] Local fallback update failed:', le)
          throw err
        }
      }
      throw err
    }
  },

  async deleteHabit(id: string, _userId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  },

  async checkInHabit(id: string, date: string, _userId: string): Promise<Habit> {
    const docRef = doc(db, COLLECTION_NAME, id)
    try {
      const snap = await getDoc(docRef)
      if (!snap.exists()) throw new Error('Habit not found')

      const item = snap.data() as any
      const datesList = Array.isArray(item.datesCompleted) ? item.datesCompleted.map(toDateKey) : []
      const dates = new Set(datesList)
      const hadDate = dates.has(date)

      console.log(`[remoteHabitsService] checkInHabit ${id} current dates:`, datesList)
      console.log(`[remoteHabitsService] checkInHabit ${id} hadDate:`, hadDate)

      const newHabitData = {
        datesCompleted: Array.from(dates),
        completed: dates.has(date),
        updatedAt: new Date().toISOString(),
        streak: hadDate ? Math.max(0, (item.streak ?? 0) - 1) : (item.streak ?? 0) + 1,
      }

      console.log(`[remoteHabitsService] checkInHabit ${id} update:`, newHabitData)
      const storedAreTimestamps = Array.isArray(item.datesCompleted) && item.datesCompleted.some((x: any) => typeof x === 'object' && typeof x?.toDate === 'function')
      try {
        if (storedAreTimestamps) {
          console.log('[remoteHabitsService] detected Timestamp entries in stored dates — using full-array update')
          await updateDoc(docRef, newHabitData)
        } else {
          if (hadDate) {
            await updateDoc(docRef, { updatedAt: newHabitData.updatedAt, datesCompleted: arrayRemove(date), completed: newHabitData.completed, streak: newHabitData.streak })
          } else {
            await updateDoc(docRef, { updatedAt: newHabitData.updatedAt, datesCompleted: arrayUnion(date), completed: newHabitData.completed, streak: newHabitData.streak })
          }
        }
      } catch (atomicErr) {
        console.warn('[remoteHabitsService] Atomic arrayOp failed or full-array update failed, falling back to full array set:', atomicErr)
        await updateDoc(docRef, newHabitData)
      }
       const updatedSnap = await getDoc(docRef)
       if (!updatedSnap.exists()) throw new Error('Habit not found after update')
       console.log(`[remoteHabitsService] checkInHabit ${id} completed`)
       console.log('[remoteHabitsService] updatedSnap raw dates:', updatedSnap.data()?.datesCompleted)
       const udata = updatedSnap.data() as any
       const udates = Array.isArray(udata.datesCompleted) ? udata.datesCompleted.map(toDateKey) : []
       const ucompleted = (typeof udata.completed === 'boolean') ? udata.completed : udates.length > 0
      if (isDev) console.log('[remoteHabitsService] updated normalized dates:', udates)

       try {
         const uid = udata.userId || _userId || ''
         if (uid) {
           const existing = readHabitsLocal(uid)
           const merged = existing.map((h) => (h.id === updatedSnap.id ? ({ id: updatedSnap.id, ...udata, datesCompleted: udates } as Habit) : h))
           const has = merged.some(m => m.id === updatedSnap.id)
           const finalList = has ? merged : [{ id: updatedSnap.id, ...udata, datesCompleted: udates } as Habit].concat(merged)
           writeHabitsLocal(uid, finalList)
         }
       } catch (e) {}
       return { id: updatedSnap.id, ...udata, datesCompleted: udates, completed: ucompleted } as Habit
    } catch (err: any) {
      console.error(`[remoteHabitsService] Failed to check-in habit ${id}:`, err)
      const msg = String(err?.code || err?.message || err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        console.warn('[remoteHabitsService] Permission error — falling back to local check-in')
        try {
          const { auth } = await import('../firebase')
          const actualUserId = auth.currentUser?.uid
          if (!actualUserId) throw new Error('No authenticated user for local fallback')
          const localUpdated = await localHabitsService.checkInHabit(id, date, actualUserId)
          return localUpdated
        } catch (le) {
          console.error('[remoteHabitsService] Local fallback check-in failed:', le)
          throw err
        }
      }
      throw err
    }
  },

}

export const habitsService = isTest ? localHabitsService : remoteHabitsService
