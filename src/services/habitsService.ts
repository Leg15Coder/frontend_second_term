import type { Habit } from '../types'

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const habitsKey = (userId: string) => `motify_habits_${userId}`

function readHabits(userId: string): Habit[] {
  if (!userId) return []
  const key = habitsKey(userId)
  const raw = storage?.getItem(key) ?? memory.get(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Habit[]
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item })) : []
  } catch {
    return []
  }
}

function writeHabits(userId: string, data: Habit[]): Habit[] {
  if (!userId) return []
  const key = habitsKey(userId)
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
  return data
}

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const habitsService = {
  async getHabits(userId: string): Promise<Habit[]> {
    return readHabits(userId)
  },

  async addHabit(habit: Omit<Habit, 'id' | 'createdAt'> & { userId: string }): Promise<Habit> {
    const list = readHabits(habit.userId)
    const next: Habit = {
      ...habit,
      id: randomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: habit.completed ?? false,
      streak: habit.streak ?? 0,
      datesCompleted: [...(habit.datesCompleted ?? [])],
    }
    writeHabits(habit.userId, [next, ...list])
    return next
  },

  async updateHabit(id: string, data: Partial<Habit> & { userId: string }): Promise<Habit> {
    const list = readHabits(data.userId)
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
    writeHabits(data.userId, updated)
    return found
  },

  async deleteHabit(id: string, userId: string): Promise<void> {
    const list = readHabits(userId)
    writeHabits(userId, list.filter((item) => item.id !== id))
  },

  async checkInHabit(id: string, date: string, userId: string): Promise<Habit> {
    const list = readHabits(userId)
    let updatedHabit: Habit | null = null

    const updated = list.map((item) => {
      if (item.id !== id) return item

      const dates = new Set(item.datesCompleted ?? [])
      const hadDate = dates.has(date)

      if (hadDate) {
        dates.delete(date)
      } else {
        dates.add(date)
      }

      const datesArray = Array.from(dates)
      const newHabit: Habit = {
        ...item,
        datesCompleted: datesArray,
        completed: dates.has(date),
        updatedAt: new Date().toISOString(),
        streak: hadDate ? Math.max(0, (item.streak ?? 0) - 1) : (item.streak ?? 0) + 1,
      }

      updatedHabit = newHabit
      return newHabit
    })

    writeHabits(userId, updated)
    if (!updatedHabit) throw new Error('Habit not found')
    return updatedHabit
  },
}
