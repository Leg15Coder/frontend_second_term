import type { GroupChallenge } from '../types'

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const key = 'motify_group_challenges'

function readChallenges(): GroupChallenge[] {
  const raw = storage?.getItem(key) ?? memory.get(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as GroupChallenge[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeChallenges(data: GroupChallenge[]): void {
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
}

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const groupChallengesService = {
  async getChallenges(groupId: string): Promise<GroupChallenge[]> {
    const all = readChallenges()
    return all.filter(c => c.groupId === groupId)
  },

  async getChallengeById(id: string): Promise<GroupChallenge | null> {
    const all = readChallenges()
    return all.find(c => c.id === id) || null
  },

  async createChallenge(challenge: Omit<GroupChallenge, 'id' | 'createdAt'>): Promise<GroupChallenge> {
    const all = readChallenges()
    const next: GroupChallenge = {
      ...challenge,
      id: randomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: challenge.participants ?? [],
      dailyChecks: challenge.dailyChecks ?? {},
    }
    writeChallenges([next, ...all])
    return next
  },

  async updateChallenge(id: string, data: Partial<GroupChallenge>): Promise<GroupChallenge> {
    const all = readChallenges()
    const index = all.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Challenge not found')

    const updated = { ...all[index], ...data, updatedAt: new Date().toISOString() }
    all[index] = updated
    writeChallenges(all)
    return updated
  },

  async deleteChallenge(id: string): Promise<void> {
    const all = readChallenges()
    writeChallenges(all.filter(c => c.id !== id))
  },

  async joinChallenge(challengeId: string, userId: string): Promise<GroupChallenge> {
    const all = readChallenges()
    const index = all.findIndex(c => c.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = all[index]
    const participants = challenge.participants ?? []

    if (participants.includes(userId)) {
      return challenge
    }

    const updated = {
      ...challenge,
      participants: [...participants, userId],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeChallenges(all)
    return updated
  },

  async leaveChallenge(challengeId: string, userId: string): Promise<GroupChallenge> {
    const all = readChallenges()
    const index = all.findIndex(c => c.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = all[index]
    const participants = challenge.participants ?? []

    const updated = {
      ...challenge,
      participants: participants.filter((p: string) => p !== userId),
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeChallenges(all)
    return updated
  },

  async checkIn(challengeId: string, userId: string, date?: string): Promise<GroupChallenge> {
    const all = readChallenges()
    const index = all.findIndex(c => c.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = all[index]
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
    all[index] = updated
    writeChallenges(all)
    return updated
  },

  async undoCheckIn(challengeId: string, userId: string, date?: string): Promise<GroupChallenge> {
    const all = readChallenges()
    const index = all.findIndex(c => c.id === challengeId)
    if (index === -1) throw new Error('Challenge not found')

    const challenge = all[index]
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
    all[index] = updated
    writeChallenges(all)
    return updated
  },
}
