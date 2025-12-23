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

export const habitsService = {
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
    // Remove id from data if present
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
