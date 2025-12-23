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

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const challengesService = {
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
