import { describe, it, expect, beforeEach, vi } from 'vitest'
import { habitsService } from './habitsService'
import type { Habit } from '../types'

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

describe('habitsService', () => {
  const userId = 'test-user-123'

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should return empty array when no habits exist', async () => {
    const habits = await habitsService.getHabits(userId)
    expect(habits).toEqual([])
  })

  it('should add a new habit', async () => {
    const newHabit = {
      title: 'Test Habit',
      description: 'Test Description',
      completed: false,
      userId,
    }

    const added = await habitsService.addHabit(newHabit)

    expect(added.id).toBeDefined()
    expect(added.title).toBe('Test Habit')
    expect(added.completed).toBe(false)
    expect(added.createdAt).toBeDefined()
  })

  it('should get habits after adding', async () => {
    const newHabit = {
      title: 'Test Habit',
      completed: false,
      userId,
    }

    await habitsService.addHabit(newHabit)
    const habits = await habitsService.getHabits(userId)

    expect(habits.length).toBe(1)
    expect(habits[0].title).toBe('Test Habit')
  })

  it('should update a habit', async () => {
    const newHabit = {
      title: 'Original',
      completed: false,
      userId,
    }

    const added = await habitsService.addHabit(newHabit)
    const updated = await habitsService.updateHabit(added.id, {
      title: 'Updated',
      userId,
    })

    expect(updated.title).toBe('Updated')
    expect(updated.id).toBe(added.id)
  })

  it('should delete a habit', async () => {
    const newHabit = {
      title: 'To Delete',
      completed: false,
      userId,
    }

    const added = await habitsService.addHabit(newHabit)
    await habitsService.deleteHabit(added.id, userId)

    const habits = await habitsService.getHabits(userId)
    expect(habits.length).toBe(0)
  })

  it('should check in a habit', async () => {
    const newHabit = {
      title: 'Daily Habit',
      completed: false,
      userId,
    }

    const added = await habitsService.addHabit(newHabit)
    const date = '2025-12-15'

    await habitsService.checkInHabit(added.id, date, userId)

    const habits = await habitsService.getHabits(userId)
    expect(habits[0].datesCompleted).toContain(date)
  })

  it('should not duplicate check-in dates', async () => {
    const newHabit = {
      title: 'Daily Habit',
      completed: false,
      userId,
    }

    const added = await habitsService.addHabit(newHabit)
    const date = '2025-12-15'

    await habitsService.checkInHabit(added.id, date, userId)
    await habitsService.checkInHabit(added.id, date, userId)

    const habits = await habitsService.getHabits(userId)
    const dates = habits[0].datesCompleted?.filter(d => d === date) || []
    expect(dates.length).toBe(1)
  })
})

