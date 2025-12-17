import type { Challenge } from '../types'

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const challengesKey = 'motify_challenges'

function readChallenges(): Challenge[] {
  const raw = storage?.getItem(challengesKey) ?? memory.get(challengesKey)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Challenge[]
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item })) : []
  } catch {
    return []
  }
}

function writeChallenges(data: Challenge[]): Challenge[] {
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(challengesKey, payload)
  else memory.set(challengesKey, payload)
  return data
}

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const challengesService = {
  async getChallenges(): Promise<Challenge[]> {
    const challenges = readChallenges()
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
      writeChallenges([demoChallenge])
      return [demoChallenge]
    }
    return challenges
  },

  async addChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge> {
    const list = readChallenges()
    const next: Challenge = {
      ...challenge,
      id: randomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: challenge.participants ?? [],
      dailyChecks: challenge.dailyChecks ?? {},
    }
    writeChallenges([...list, next])
    return next
  },

  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge> {
    const list = readChallenges()
    const index = list.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Challenge not found')
    const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() }
    list[index] = updated
    writeChallenges(list)
    return updated
  },

  async deleteChallenge(id: string): Promise<void> {
    const list = readChallenges()
    writeChallenges(list.filter((item) => item.id !== id))
  },

  async joinChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const list = readChallenges()
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
    writeChallenges(list)
    return updated
  },

  async leaveChallenge(challengeId: string, userId: string): Promise<Challenge> {
    const list = readChallenges()
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
    writeChallenges(list)
    return updated
  },

  async checkInChallenge(challengeId: string, userId: string, date?: string): Promise<Challenge> {
    const list = readChallenges()
    const index = list.findIndex((item) => item.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = list[index]
    const dailyChecks = challenge.dailyChecks ?? {}
    const userChecks = dailyChecks[userId] ?? []
    const checkDate = date ?? new Date().toISOString().split('T')[0]

    if (userChecks.includes(checkDate)) {
      return challenge
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
    writeChallenges(list)
    return updated
  },
}

