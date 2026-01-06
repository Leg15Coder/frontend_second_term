import { db } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import type { Challenge } from '../types'

const COLLECTION_NAME = 'challenges'

const isTest = (typeof process !== 'undefined' && (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test')) ||
               (typeof window !== 'undefined' && typeof (window as any).Cypress !== 'undefined' && (window as any).Cypress === true)

if (typeof window !== 'undefined') {
  console.log('[ChallengesService] isTest:', isTest, 'Cypress:', typeof (window as any).Cypress, 'Value:', (window as any).Cypress)
}

const memory = new Map<string, string>()
const key = 'motify_challenges'

function getStorage() {
  return (typeof window !== 'undefined' ? (window as any).localStorage : null) as Storage | null
}

function readChallengesLocal(): Challenge[] {
  const storage = getStorage()
  const raw = storage?.getItem(key) ?? memory.get(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Challenge[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeChallengesLocal(data: Challenge[]): Challenge[] {
  const payload = JSON.stringify(data)
  const storage = getStorage()
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
  return data
}

const localChallengesService = {
  async getChallenges(): Promise<Challenge[]> {
    console.log('[localChallengesService] getChallenges called')
    const challenges = readChallengesLocal()
    console.log('[localChallengesService] challenges from localStorage:', challenges.length)
    if (challenges.length === 0) {
      const demoChallenge: Challenge = {
        id: 'demo-30-day-challenge',
        title: '30-дневный вызов привычек',
        description: 'Создайте и поддерживайте ежедневные привычки в течение 30 дней',
        days: 30,
        startDate: new Date().toISOString(),
        participants: [],
        dailyChecks: {},
        createdAt: new Date().toISOString(),
      }
      console.log('[localChallengesService] No challenges found, creating demo')
      writeChallengesLocal([demoChallenge])
      return [demoChallenge]
    }
    return challenges
  },

  async addChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge> {
    const list = readChallengesLocal()
    const next: Challenge = {
      ...challenge,
      id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: challenge.participants ?? [],
      dailyChecks: challenge.dailyChecks ?? {},
    }
    writeChallengesLocal([...list, next])
    return next
  },

  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge> {
    const list = readChallengesLocal()
    const index = list.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Challenge not found')
    const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() }
    list[index] = updated
    writeChallengesLocal(list)
    return updated
  },

  async deleteChallenge(id: string): Promise<void> {
    const list = readChallengesLocal()
    writeChallengesLocal(list.filter((item) => item.id !== id))
  },

  async joinChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const list = readChallengesLocal()
    const index = list.findIndex((item) => item.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = list[index]
    const participants = challenge.participants ?? []

    if (participants.includes(userId)) {
      return challenge
    }

    const updated = {
      ...challenge,
      participants: [...participants, userId],
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    writeChallengesLocal(list)
    return updated
  },

  async leaveChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const list = readChallengesLocal()
    const index = list.findIndex((item) => item.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = list[index]
    const participants = challenge.participants ?? []

    const updated = {
      ...challenge,
      participants: participants.filter((id) => id !== userId),
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    writeChallengesLocal(list)
    return updated
  },

  async checkInChallenge(challengeId: string, userId: string, date?: string): Promise<Challenge> {
    const list = readChallengesLocal()
    const index = list.findIndex((item) => item.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = list[index]
    const dailyChecks = challenge.dailyChecks ?? {}
    let userChecks = dailyChecks[userId] ?? []
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    if (userChecks.includes(checkDate)) {
      return challenge
    }

    const mode = challenge.mode ?? 'cumulative'

    if (mode === 'streak' && userChecks.length > 0) {
      const sortedChecks = [...userChecks].sort()
      const lastCheck = sortedChecks[sortedChecks.length - 1]
      const lastCheckDate = new Date(lastCheck)
      const currentDate = new Date(checkDate)

      const diffDays = Math.floor((currentDate.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays > 1) {
        userChecks = []
        challenge.lastResetDate = checkDate
      }
    }

    const updated = {
      ...challenge,
      dailyChecks: {
        ...dailyChecks,
        [userId]: [...userChecks, checkDate],
      },
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    writeChallengesLocal(list)
    return updated
  },

  async undoCheckIn(challengeId: string, userId: string, date?: string): Promise<Challenge> {
    const list = readChallengesLocal()
    const index = list.findIndex((item) => item.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = list[index]
    const dailyChecks = challenge.dailyChecks ?? {}
    const userChecks = dailyChecks[userId] ?? []
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    if (!userChecks.includes(checkDate)) {
      return challenge
    }

    const updated = {
      ...challenge,
      dailyChecks: {
        ...dailyChecks,
        [userId]: userChecks.filter((d: string) => d !== checkDate),
      },
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    writeChallengesLocal(list)
    return updated
  },
}

const remoteChallengesService = {
  async getChallenges(): Promise<Challenge[]> {
    try {
      const demoDocRef = doc(db, COLLECTION_NAME, 'demo-30-day-challenge')
      const demoSnap = await getDoc(demoDocRef)

      if (!demoSnap.exists()) {
        const demoChallenge: Omit<Challenge, 'id'> = {
          title: '30-дневный вызов привычек',
          description: 'Создайте и поддерживайте ежедневные привычки в течение 30 дней',
          days: 30,
          startDate: new Date().toISOString(),
          participants: [],
          dailyChecks: {},
          createdAt: new Date().toISOString(),
        }

        let createdSucceeded = false
        try {
          await setDoc(demoDocRef, demoChallenge)
          let createdSnap = await getDoc(demoDocRef)
          let attempts = 0
          while (!createdSnap.exists() && attempts < 3) {
            attempts++
            console.warn(`demoDoc creation not visible yet, retrying (${attempts})...`)
            await new Promise((res) => setTimeout(res, 500))
            createdSnap = await getDoc(demoDocRef)
          }
          if (!createdSnap.exists()) {
            console.error('Failed to create demo challenge after retries')
            throw new Error('Challenge with id demo-30-day-challenge not found')
          }
          console.log('Demo challenge created with ID: demo-30-day-challenge')
          createdSucceeded = true
        } catch (e) {
          console.error('[remoteChallengesService] Failed to set demo challenge in Firestore:', e)
          console.error('[remoteChallengesService] Falling back to local demo')
        }

      } else {
        console.log('[remoteChallengesService] Demo challenge exists:', {
          id: demoSnap.id,
          participants: demoSnap.data()?.participants,
          participantsCount: demoSnap.data()?.participants?.length || 0
        })
      }

      const snapshot = await getDocs(collection(db, COLLECTION_NAME))
      const challenges = snapshot.docs.map((d) => {
        const data = d.data() as any
        if ('id' in data) {
          const cleaned = { ...data }
          delete cleaned.id
          return ({ id: d.id, ...cleaned } as Challenge)
        }
        return ({ id: d.id, ...data } as Challenge)
      })

      console.log('[remoteChallengesService] Loaded challenges total:', challenges.length)
      challenges.forEach((ch, idx) => {
        console.log(`  Challenge[${idx}]: id="${ch.id}", title="${ch.title}", participants=${ch.participants?.length || 0}`)
      })

      const demoChallenges = challenges.filter(c => c.id === 'demo-30-day-challenge')

      if (demoChallenges.length > 1) {
        console.log('[remoteChallengesService] MULTIPLE demo challenges found! Deleting extras...')
        demoChallenges.sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))

        const validChallenge = demoChallenges[0]
        const duplicates = demoChallenges.slice(1)

        for (const dup of duplicates) {
          try {
            console.log(`  Deleting duplicate demo challenge with ${dup.participants?.length || 0} participants`)
            await deleteDoc(doc(db, COLLECTION_NAME, dup.id))
          } catch (e) {
            console.error('  Failed to delete duplicate:', e)
          }
        }

        const result = [validChallenge]
        console.log('[remoteChallengesService] RETURNING challenges:', result.length)
        result.forEach((ch, idx) => {
          console.log(`  RETURN[${idx}]: id="${ch.id}", participants=${ch.participants?.length || 0}, participantsList=${JSON.stringify(ch.participants)}`)
        })
        return result
      }

      const otherDuplicates = challenges.filter(c => c.id !== 'demo-30-day-challenge' && c.title === '30-дневный вызов привычек')
      if (otherDuplicates.length > 0) {
        console.log('[remoteChallengesService] Found duplicates with different IDs to cleanup:', otherDuplicates.length)
        for (const dup of otherDuplicates) {
          try {
            console.log(`  Deleting duplicate challenge: ${dup.id}`)
            await deleteDoc(doc(db, COLLECTION_NAME, dup.id))
          } catch (e) {
            console.error('  Failed to delete duplicate:', e)
          }
        }
      }

      if (demoChallenges.length > 0) {
        console.log('[remoteChallengesService] RETURNING challenges from server:', demoChallenges.length)
        demoChallenges.forEach((ch, idx) => {
          console.log(`  RETURN[${idx}]: id="${ch.id}", participants=${ch.participants?.length || 0}, participantsList=${JSON.stringify(ch.participants)}`)
        })
        return demoChallenges
      }

      try {
        const local = await localChallengesService.getChallenges()
        console.log('[remoteChallengesService] Falling back to local challenges:', local.length)
        return local
      } catch (e) {
        console.error('[remoteChallengesService] Failed to read local challenges as fallback:', e)
        return []
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      return []
    }
  },

  async addChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge> {
    const next: Omit<Challenge, 'id'> = {
      ...challenge,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: challenge.participants ?? [],
      dailyChecks: challenge.dailyChecks ?? {},
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), next)
    return { ...next, id: docRef.id } as Challenge
  },

  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = { ...data, updatedAt: new Date().toISOString() }
    const { id: _, ...cleanData } = updateData as any
    await updateDoc(docRef, cleanData)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    return { id: snap.id, ...snap.data() } as Challenge
  },

  async deleteChallenge(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  },

  async joinChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    let snap = await getDoc(docRef)

    if (!snap.exists()) {
      if (challengeId === 'demo-30-day-challenge') {
        console.warn(`Demo challenge ${challengeId} not found, создавая его`)
        const demoChallenge: Omit<Challenge, 'id'> = {
          title: '30-дневный вызов привычек',
          description: 'Создайте и поддерживайте ежедневные привычки в течение 30 дней',
          days: 30,
          startDate: new Date().toISOString(),
          participants: [],
          dailyChecks: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await setDoc(docRef, demoChallenge)
        snap = await getDoc(docRef)
        let createdSnap = await getDoc(docRef)
        let attempts = 0
        while (!createdSnap.exists() && attempts < 3) {
          attempts++
          console.warn(`demoDoc creation not visible yet, retrying (${attempts})...`)
          await new Promise((res) => setTimeout(res, 500))
          createdSnap = await getDoc(docRef)
        }
        if (!createdSnap.exists()) {
          console.error('Failed to create demo challenge after retries')
          throw new Error('Challenge with id demo-30-day-challenge not found')
        }
        console.log('Demo challenge created with ID: demo-30-day-challenge')
      } else {
        console.error(`Challenge ${challengeId} not found in Firestore`)
        throw new Error(`Challenge with id ${challengeId} not found`)
      }
    }

    console.log(`Joining challenge ${challengeId} for user ${userId}`)
    const snapDataBefore = snap && typeof snap.data === 'function' ? snap.data() : undefined
    console.log(`Current participants BEFORE update:`, (snapDataBefore?.participants) || [])

    try {
      await updateDoc(docRef, {
        participants: arrayUnion(userId),
        updatedAt: new Date().toISOString()
      })
      console.log(`Challenge ${challengeId} updated successfully`)
    } catch (updateError) {
      console.error(`FAILED to update challenge ${challengeId}:`, updateError)
      console.error(`Error code:`, (updateError as any)?.code)
      console.error(`Error message:`, (updateError as any)?.message)
      throw updateError
    }

    const updatedSnap = await getDoc(docRef)
    if (!updatedSnap.exists()) throw new Error('Challenge not found after update')

    const result = { id: updatedSnap.id, ...updatedSnap.data() } as Challenge
    console.log(`Challenge participants AFTER update:`, result.participants)
    console.log(`User ${userId} is now participating:`, result.participants?.includes(userId))

    return result
  },

  async leaveChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    let snap = await getDoc(docRef)

    if (!snap.exists()) {
      if (challengeId === 'demo-30-day-challenge') {
        console.warn(`Demo challenge ${challengeId} not found on leave, создавая его`)
        const demoChallenge: Omit<Challenge, 'id'> = {
          title: '30-дневный вызов привычек',
          description: 'Создайте и поддерживайте ежедневные привычки в течение 30 дней',
          days: 30,
          startDate: new Date().toISOString(),
          participants: [],
          dailyChecks: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await setDoc(docRef, demoChallenge)
        snap = await getDoc(docRef)
        if (!snap.exists()) throw new Error(`Challenge with id ${challengeId} not found`)
      } else {
        throw new Error(`Challenge with id ${challengeId} not found`)
      }
    }

    await updateDoc(docRef, {
      participants: arrayRemove(userId),
      updatedAt: new Date().toISOString()
    })

    const updatedSnap = await getDoc(docRef)
    if (!updatedSnap.exists()) throw new Error('Challenge not found after update')
    return { id: updatedSnap.id, ...updatedSnap.data() } as Challenge
  },

  async checkInChallenge(challengeId: string, userId: string, date?: string): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    let snap = await getDoc(docRef)
    if (!snap.exists()) {
      if (challengeId === 'demo-30-day-challenge') {
        console.warn(`Demo challenge ${challengeId} not found on checkIn, создавая его`)
        const demoChallenge: Omit<Challenge, 'id'> = {
          title: '30-дневный вызов привычек',
          description: 'Создайте и поддерживайте ежедневные привычки в течение 30 дней',
          days: 30,
          startDate: new Date().toISOString(),
          participants: [],
          dailyChecks: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await setDoc(docRef, demoChallenge)
        snap = await getDoc(docRef)
        if (!snap.exists()) throw new Error(`Challenge with id ${challengeId} not found`)
      } else {
        throw new Error(`Challenge with id ${challengeId} not found`)
      }
    }
    const challenge = snap.data() as Challenge

    const dailyChecks = challenge.dailyChecks ?? {}
    const userChecks = dailyChecks[userId] ?? []
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    if (userChecks.includes(checkDate)) return Object.assign({ id: snap.id }, challenge) as Challenge

    dailyChecks[userId] = [...userChecks, checkDate]

    await updateDoc(docRef, {
      dailyChecks,
      updatedAt: new Date().toISOString()
    })

    const updatedSnap = await getDoc(docRef)
    if (!updatedSnap.exists()) throw new Error('Challenge not found after update')
    return { id: updatedSnap.id, ...updatedSnap.data() } as Challenge
  },

  async undoCheckIn(challengeId: string, userId: string, date?: string): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    await updateDoc(docRef, {
      [`dailyChecks.${userId}`]: arrayRemove(checkDate),
      updatedAt: new Date().toISOString(),
    })

    const updatedSnap = await getDoc(docRef)
    return { id: updatedSnap.id, ...updatedSnap.data() } as Challenge
  },
}

export const challengesService = isTest ? localChallengesService : remoteChallengesService

if (typeof window !== 'undefined') {
  console.log('[ChallengesService] Using:', isTest ? 'localStorage (local)' : 'Firestore (remote)')
  console.log('[ChallengesService] Service methods:', Object.keys(challengesService))
  console.log('[ChallengesService] joinChallenge is:', challengesService.joinChallenge.toString().slice(0, 200))
}
