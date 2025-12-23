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
import type { Goal } from '../types'

const COLLECTION_NAME = 'goals'

export const goalsService = {
  async getGoals(userId: string): Promise<Goal[]> {
    if (!userId) return []
    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal))
    } catch (error) {
      console.error('Error fetching goals:', error)
      return []
    }
  },

  async addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }): Promise<Goal> {
    const newGoal = {
      ...goal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: goal.progress ?? 0,
      completed: goal.completed ?? false,
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newGoal)
    return { ...newGoal, id: docRef.id }
  },

  async updateGoal(id: string, data: Partial<Goal> & { userId: string }): Promise<Goal> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    }
    const { id: _, ...cleanData } = updateData as any

    await updateDoc(docRef, cleanData)

    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Goal not found')

    return { id: snap.id, ...snap.data() } as Goal
  },

  async deleteGoal(id: string, _userId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  },
}
