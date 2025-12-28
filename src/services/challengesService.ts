import { db } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import type { Challenge } from '../types'

const COLLECTION_NAME = 'challenges'

const isTest = (typeof process !== 'undefined' && (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test')) ||
               (typeof window !== 'undefined' && (window as any).Cypress)

if (typeof window !== 'undefined') {
  console.log('[ChallengesService] isTest:', isTest, 'Cypress:', !!(window as any).Cypress)
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
      const snapshot = await getDocs(collection(db, COLLECTION_NAME))
      if (snapshot.empty) {
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
        await addDoc(collection(db, COLLECTION_NAME), demoChallenge)
        return [demoChallenge]
      }
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Challenge))
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
    await updateDoc(docRef, { participants: arrayUnion(userId), updatedAt: new Date().toISOString() })
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    return { id: snap.id, ...snap.data() } as Challenge
  },

  async leaveChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    await updateDoc(docRef, { participants: arrayRemove(userId), updatedAt: new Date().toISOString() })
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    return { id: snap.id, ...snap.data() } as Challenge
  },

  async checkInChallenge(challengeId: string, userId: string, date?: string): Promise<Challenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    const challenge = snap.data() as Challenge

    const dailyChecks = challenge.dailyChecks ?? {}
    const userChecks = dailyChecks[userId] ?? []
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    if (userChecks.includes(checkDate)) {
      const { id: _id, ...rest } = challenge as any
      return { ...rest, id: snap.id } as Challenge
    }

    await updateDoc(docRef, {
      [`dailyChecks.${userId}`]: arrayUnion(checkDate),
      updatedAt: new Date().toISOString(),
    })

    const updatedSnap = await getDoc(docRef)
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
