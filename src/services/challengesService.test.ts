import { describe, it, expect, beforeEach } from 'vitest'
import { challengesService } from './challengesService'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('challengesService', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should initialize with demo challenge', async () => {
    const challenges = await challengesService.getChallenges()
    expect(challenges.length).toBeGreaterThan(0)
    expect(challenges[0].title).toBeDefined()
  })

  it('should add a new challenge', async () => {
    localStorageMock.clear() // Clear to start fresh

    const newChallenge = {
      title: '7 Day Challenge',
      description: 'Test challenge',
      days: 7,
      participants: [],
      dailyChecks: {},
    }

    const added = await challengesService.addChallenge(newChallenge)

    expect(added.id).toBeDefined()
    expect(added.title).toBe('7 Day Challenge')
    expect(added.days).toBe(7)
  })

  it('should join a challenge', async () => {
    const challenges = await challengesService.getChallenges()
    const challengeId = challenges[0].id
    const userId = 'user-123'

    const updated = await challengesService.joinChallenge(challengeId, userId)

    expect(updated.participants).toContain(userId)
  })

  it('should not duplicate participants', async () => {
    const challenges = await challengesService.getChallenges()
    const challengeId = challenges[0].id
    const userId = 'user-456'

    await challengesService.joinChallenge(challengeId, userId)
    await challengesService.joinChallenge(challengeId, userId)

    const allChallenges = await challengesService.getChallenges()
    const challenge = allChallenges.find(c => c.id === challengeId)

    const userCount = challenge?.participants?.filter(p => p === userId).length || 0
    expect(userCount).toBe(1)
  })

  it('should leave a challenge', async () => {
    const challenges = await challengesService.getChallenges()
    const challengeId = challenges[0].id
    const userId = 'user-789'

    await challengesService.joinChallenge(challengeId, userId)
    const updated = await challengesService.leaveChallenge(challengeId, userId)

    expect(updated.participants).not.toContain(userId)
  })

  it('should check in to a challenge', async () => {
    const challenges = await challengesService.getChallenges()
    const challengeId = challenges[0].id
    const userId = 'user-check'
    const date = '2025-12-15'

    const updated = await challengesService.checkInChallenge(challengeId, userId, date)

    expect(updated.dailyChecks?.[userId]).toContain(date)
  })

  it('should not duplicate check-in dates', async () => {
    const challenges = await challengesService.getChallenges()
    const challengeId = challenges[0].id
    const userId = 'user-dupe'
    const date = '2025-12-15'

    await challengesService.checkInChallenge(challengeId, userId, date)
    await challengesService.checkInChallenge(challengeId, userId, date)

    const allChallenges = await challengesService.getChallenges()
    const challenge = allChallenges.find(c => c.id === challengeId)

    const dates = challenge?.dailyChecks?.[userId]?.filter(d => d === date) || []
    expect(dates.length).toBe(1)
  })

  it('should delete a challenge', async () => {
    const newChallenge = {
      title: 'To Delete',
      days: 5,
      participants: [],
      dailyChecks: {},
    }

    const added = await challengesService.addChallenge(newChallenge)
    await challengesService.deleteChallenge(added.id)

    const challenges = await challengesService.getChallenges()
    const found = challenges.find(c => c.id === added.id)
    expect(found).toBeUndefined()
  })
})

