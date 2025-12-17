import type { Goal } from '../types'

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const goalsKey = (userId: string) => `motify_goals_${userId}`

function readGoals(userId: string): Goal[] {
  if (!userId) return []
  const key = goalsKey(userId)
  const raw = storage?.getItem(key) ?? memory.get(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Goal[]
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item })) : []
  } catch {
    return []
  }
}

function writeGoals(userId: string, data: Goal[]): Goal[] {
  if (!userId) return []
  const key = goalsKey(userId)
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
  return data
}

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const goalsService = {
  async getGoals(userId: string): Promise<Goal[]> {
    return readGoals(userId)
  },

  async addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }): Promise<Goal> {
    const next: Goal = {
      ...goal,
      id: randomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: goal.progress ?? 0,
      completed: goal.completed ?? false,
    }
    const list = readGoals(goal.userId)
    writeGoals(goal.userId, [next, ...list])
    return next
  },

  async updateGoal(id: string, data: Partial<Goal> & { userId: string }): Promise<Goal> {
    const list = readGoals(data.userId)
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
    writeGoals(data.userId, updated)
    return found
  },

  async deleteGoal(id: string, userId: string): Promise<void> {
    const list = readGoals(userId)
    writeGoals(userId, list.filter((item) => item.id !== id))
  },
}
