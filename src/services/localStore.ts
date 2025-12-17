import type { Habit, Goal } from '@/types'

const memoryStore = new Map<string, string>()

const storage = typeof window !== 'undefined' ? window.localStorage : null

const getKey = (entity: 'habits' | 'goals', userId: string) => `motify_${entity}_${userId}`

function readRaw(key: string) {
  if (storage) return storage.getItem(key)
  return memoryStore.get(key) ?? null
}

function writeRaw(key: string, value: string) {
  if (storage) {
    storage.setItem(key, value)
    return
  }
  memoryStore.set(key, value)
}

function read<T>(entity: 'habits' | 'goals', userId: string, fallback: T[]): T[] {
  if (!userId) return [...fallback]
  try {
    const raw = readRaw(getKey(entity, userId))
    if (!raw) return [...fallback]
    return JSON.parse(raw) as T[]
  } catch (err) {
    console.warn(`[localStore] Failed to read ${entity}`, err)
    return [...fallback]
  }
}

function write<T>(entity: 'habits' | 'goals', userId: string, data: T[]): T[] {
  if (!userId) return data
  try {
    writeRaw(getKey(entity, userId), JSON.stringify(data))
  } catch (err) {
    console.warn(`[localStore] Failed to write ${entity}`, err)
  }
  return data
}

const emptyHabits: Habit[] = []
const emptyGoals: Goal[] = []

export const localStore = {
  getHabits(userId: string): Habit[] {
    return read<Habit>('habits', userId, emptyHabits)
  },
  saveHabits(userId: string, data: Habit[]): Habit[] {
    return write<Habit>('habits', userId, data)
  },
  getGoals(userId: string): Goal[] {
    return read<Goal>('goals', userId, emptyGoals)
  },
  saveGoals(userId: string, data: Goal[]): Goal[] {
    return write<Goal>('goals', userId, data)
  },
}
