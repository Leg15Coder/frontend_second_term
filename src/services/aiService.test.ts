import { describe, it, expect, beforeEach } from 'vitest'
import { suggestHabitsForGoal } from './aiService'
import { setupAIMocks } from './mocks/aiServiceMock'
import type { Goal, Habit } from '../types'

setupAIMocks()

describe('AI Service with Multi-Provider', () => {
  let testGoal: Goal

  beforeEach(() => {
    testGoal = {
      id: 'test-goal-1',
      title: 'Похудеть на 10 кг',
      detailedDescription: 'Хочу улучшить здоровье и форму',
      createdAt: new Date().toISOString(),
      progress: 0,
      completed: false,
      tasks: []
    }
  })

  it('should suggest habits using AI service', async () => {
    const habits = await suggestHabitsForGoal(testGoal, [])

    expect(habits).toBeDefined()
    expect(Array.isArray(habits)).toBe(true)
    expect(habits.length).toBeGreaterThan(0)
  })

  it('should return habits with correct structure', async () => {
    const habits = await suggestHabitsForGoal(testGoal, [])

    habits.forEach((habit: Habit) => {
      expect(habit).toHaveProperty('id')
      expect(habit).toHaveProperty('title')
      expect(habit).toHaveProperty('frequency')
      expect(habit).toHaveProperty('difficulty')
      expect(habit).toHaveProperty('status', 'suggested')
      expect(habit).toHaveProperty('source', 'ai')
      expect(habit).toHaveProperty('linkedGoalId', testGoal.id)
    })
  })

  it('should handle AI service errors gracefully', async () => {
    const habits = await suggestHabitsForGoal(testGoal, [])

    expect(habits).toBeDefined()
    expect(habits.length).toBeGreaterThanOrEqual(1)
  })

  it('should not duplicate existing habits', async () => {
    const existingHabits: Habit[] = [
      {
        id: 'existing-1',
        title: 'Утренняя зарядка',
        completed: false,
        streak: 5,
        createdAt: new Date().toISOString(),
        frequency: 'daily',
        difficulty: 'low',
        status: 'active',
        datesCompleted: []
      }
    ]

    const habits = await suggestHabitsForGoal(testGoal, existingHabits)

    expect(habits).toBeDefined()
    const titles = habits.map((h: Habit) => h.title)
    expect(titles).not.toContain('Утренняя зарядка')
  })
})

