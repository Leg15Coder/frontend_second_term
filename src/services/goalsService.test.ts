import { describe, it, expect, beforeEach } from 'vitest'
import { goalsService } from './goalsService'

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

describe('goalsService', () => {
  const userId = 'test-user-123'

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should return empty array when no goals exist', async () => {
    const goals = await goalsService.getGoals(userId)
    expect(goals).toEqual([])
  })

  it('should add a new goal', async () => {
    const newGoal = {
      title: 'Test Goal',
      description: 'Test Description',
      progress: 0,
      completed: false,
      userId,
    }

    const added = await goalsService.addGoal(newGoal)

    expect(added.id).toBeDefined()
    expect(added.title).toBe('Test Goal')
    expect(added.progress).toBe(0)
    expect(added.createdAt).toBeDefined()
  })

  it('should get goals after adding', async () => {
    const newGoal = {
      title: 'Test Goal',
      progress: 50,
      completed: false,
      userId,
    }

    await goalsService.addGoal(newGoal)
    const goals = await goalsService.getGoals(userId)

    expect(goals.length).toBe(1)
    expect(goals[0].title).toBe('Test Goal')
    expect(goals[0].progress).toBe(50)
  })

  it('should update a goal', async () => {
    const newGoal = {
      title: 'Original Goal',
      progress: 0,
      completed: false,
      userId,
    }

    const added = await goalsService.addGoal(newGoal)
    const updated = await goalsService.updateGoal(added.id, {
      title: 'Updated Goal',
      progress: 75,
      userId,
    })

    expect(updated.title).toBe('Updated Goal')
    expect(updated.progress).toBe(75)
    expect(updated.id).toBe(added.id)
  })

  it('should delete a goal', async () => {
    const newGoal = {
      title: 'To Delete',
      progress: 0,
      completed: false,
      userId,
    }

    const added = await goalsService.addGoal(newGoal)
    await goalsService.deleteGoal(added.id, userId)

    const goals = await goalsService.getGoals(userId)
    expect(goals.length).toBe(0)
  })

  it('should support goals with tasks', async () => {
    const newGoal = {
      title: 'Goal with Tasks',
      progress: 0,
      completed: false,
      tasks: [
        { id: '1', title: 'Task 1', done: false },
        { id: '2', title: 'Task 2', done: true },
      ],
      userId,
    }

    const added = await goalsService.addGoal(newGoal)
    expect(added.tasks).toBeDefined()
    expect(added.tasks?.length).toBe(2)

    const goals = await goalsService.getGoals(userId)
    expect(goals[0].tasks?.length).toBe(2)
  })
})

