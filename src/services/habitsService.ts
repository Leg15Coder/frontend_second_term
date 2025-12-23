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
  getDoc
} from 'firebase/firestore'
import type { Habit } from '../types'

const COLLECTION_NAME = 'habits'

const isTest = typeof process !== 'undefined' && (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test')

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

const remoteHabitsService = {
  async getHabits(userId: string): Promise<Habit[]> {
    if (!userId) return []
    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit))
    } catch (error) {
      console.error('Error fetching habits:', error)
      return []
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

    await updateDoc(docRef, cleanData)

    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Habit not found')

    return { id: snap.id, ...snap.data() } as Habit
  },

  async deleteHabit(id: string, _userId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  },

  async checkInHabit(id: string, date: string, _userId: string): Promise<Habit> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Habit not found')

    const item = snap.data() as Habit
    const dates = new Set(item.datesCompleted ?? [])
    const hadDate = dates.has(date)

    if (hadDate) {
      dates.delete(date)
    } else {
      dates.add(date)
    }

    const datesArray = Array.from(dates)
    const newHabitData = {
      datesCompleted: datesArray,
      completed: dates.has(date),
      updatedAt: new Date().toISOString(),
      streak: hadDate ? Math.max(0, (item.streak ?? 0) - 1) : (item.streak ?? 0) + 1,
    }

    await updateDoc(docRef, newHabitData)

    return { ...item, ...newHabitData, id }
  },
}

export const habitsService = isTest ? localHabitsService : remoteHabitsService
