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
import type { GroupChallenge } from '../types'

const COLLECTION_NAME = 'group_challenges'

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const groupChallengesService = {
  async getChallenges(groupId: string): Promise<GroupChallenge[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('groupId', '==', groupId))
      const snap = await getDocs(q)
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as GroupChallenge))
    } catch (error) {
      console.error('Error fetching group challenges:', error)
      return []
    }
  },

  async getChallengeById(id: string): Promise<GroupChallenge | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const snap = await getDoc(docRef)
      if (!snap.exists()) return null
      return { id: snap.id, ...snap.data() } as GroupChallenge
    } catch (error) {
      console.error('Error fetching challenge:', error)
      return null
    }
  },

  async createChallenge(challenge: Omit<GroupChallenge, 'id' | 'createdAt'>): Promise<GroupChallenge> {
    const next = {
      ...challenge,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: challenge.participants ?? [],
      dailyChecks: challenge.dailyChecks ?? {},
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), next)
    return { ...next, id: docRef.id } as GroupChallenge
  },

  async updateChallenge(id: string, data: Partial<GroupChallenge>): Promise<GroupChallenge> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = { ...data, updatedAt: new Date().toISOString() }
    const { id: _, ...cleanData } = updateData as any
    await updateDoc(docRef, cleanData)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    return { id: snap.id, ...snap.data() } as GroupChallenge
  },

  async deleteChallenge(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  },

  async joinChallenge(challengeId: string, userId: string): Promise<GroupChallenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    await updateDoc(docRef, { participants: arrayUnion(userId), updatedAt: new Date().toISOString() })
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    return { id: snap.id, ...snap.data() } as GroupChallenge
  },

  async leaveChallenge(challengeId: string, userId: string): Promise<GroupChallenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    await updateDoc(docRef, { participants: arrayRemove(userId), updatedAt: new Date().toISOString() })
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    return { id: snap.id, ...snap.data() } as GroupChallenge
  },

  async checkIn(challengeId: string, userId: string, date?: string): Promise<GroupChallenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    const challenge = snap.data() as GroupChallenge

    const dailyChecks = challenge.dailyChecks ?? {}
    const userChecks = dailyChecks[userId] ?? []
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    if (userChecks.includes(checkDate)) {
      const { id: _id, ...rest } = challenge as any
      return { ...rest, id: snap.id } as GroupChallenge
    }

    await updateDoc(docRef, {
      [`dailyChecks.${userId}`]: arrayUnion(checkDate),
      updatedAt: new Date().toISOString(),
    })

    const updatedSnap = await getDoc(docRef)
    return { id: updatedSnap.id, ...updatedSnap.data() } as GroupChallenge
  },

  async undoCheckIn(challengeId: string, userId: string, date?: string): Promise<GroupChallenge> {
    const docRef = doc(db, COLLECTION_NAME, challengeId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Challenge not found')
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    await updateDoc(docRef, {
      [`dailyChecks.${userId}`]: arrayRemove(checkDate),
      updatedAt: new Date().toISOString(),
    })

    const updatedSnap = await getDoc(docRef)
    return { id: updatedSnap.id, ...updatedSnap.data() } as GroupChallenge
  },
}
