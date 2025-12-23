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

const isTest = typeof process !== 'undefined' && (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test')

const memory = new Map<string, string>()
const goalsKey = (userId: string) => `motify_goals_${userId}`

function getStorage() {
  return (typeof window !== 'undefined' ? (window as any).localStorage : null) as Storage | null
}

function readGoalsLocal(userId: string): Goal[] {
  if (!userId) return []
  const key = goalsKey(userId)
  const storage = getStorage()
  const raw = storage?.getItem(key) ?? memory.get(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Goal[]
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item })) : []
  } catch {
    return []
  }
}

function writeGoalsLocal(userId: string, data: Goal[]): Goal[] {
  if (!userId) return data
  const key = goalsKey(userId)
  const payload = JSON.stringify(data)
  const storage = getStorage()
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
  return data
}

const localGoalsService = {
  async getGoals(userId: string): Promise<Goal[]> {
    return readGoalsLocal(userId)
  },

  async addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }): Promise<Goal> {
    const list = readGoalsLocal(goal.userId)
    const next: Goal = {
      ...goal,
      id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: goal.progress ?? 0,
      completed: goal.completed ?? false,
    }
    writeGoalsLocal(goal.userId, [next, ...list])
    return next
  },

  async updateGoal(id: string, data: Partial<Goal> & { userId: string }): Promise<Goal> {
    const list = readGoalsLocal(data.userId)
    let found: Goal | null = null
    const updated = list.map((item) => {
      if (item.id !== id) return item
      const next: Goal = {
        ...item,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      found = next
      return next
    })
    if (!found) throw new Error('Goal not found')
    writeGoalsLocal(data.userId, updated)
    return found
  },

  async deleteGoal(id: string, userId: string): Promise<void> {
    const list = readGoalsLocal(userId)
    writeGoalsLocal(userId, list.filter((item) => item.id !== id))
  },
}

const remoteGoalsService = {
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

export const goalsService = isTest ? localGoalsService : remoteGoalsService
