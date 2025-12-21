import { describe, it, expect } from 'vitest'
import {
  validateTaskStructure,
  deduplicateTasks,
  makeSMART,
  prioritizeTasks,
  filterInvalidTasks,
  postprocessTasks,
  type GoalContext
} from './taskValidation'
import type { GoalTask } from '@/types'

describe('taskValidation', () => {
  describe('validateTaskStructure', () => {
    it('should accept valid task', () => {
      const task = {
        id: '1',
        title: 'Valid task',
        description: 'Test description',
        done: false
      }
      expect(validateTaskStructure(task)).toBe(true)
    })

    it('should reject task without title', () => {
      const task = { id: '1', done: false }
      expect(validateTaskStructure(task)).toBe(false)
    })

    it('should reject task with empty title', () => {
      const task = { id: '1', title: '   ', done: false }
      expect(validateTaskStructure(task)).toBe(false)
    })

    it('should reject task with too long title', () => {
      const task = { id: '1', title: 'x'.repeat(201), done: false }
      expect(validateTaskStructure(task)).toBe(false)
    })

    it('should reject task with invalid estimates', () => {
      const task = { id: '1', title: 'Test', week_estimate: -1, done: false }
      expect(validateTaskStructure(task)).toBe(false)
    })
  })

  describe('deduplicateTasks', () => {
    it('should remove exact duplicates', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Task 1', done: false },
        { id: '2', title: 'Task 1', done: false },
        { id: '3', title: 'Task 2', done: false }
      ]
      const result = deduplicateTasks(tasks)
      expect(result).toHaveLength(2)
    })

    it('should remove similar tasks', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Complete the project', done: false },
        { id: '2', title: 'Complete project', done: false },
        { id: '3', title: 'Different task', done: false }
      ]
      const result = deduplicateTasks(tasks)
      expect(result.length).toBeLessThanOrEqual(2)
    })

    it('should keep distinct tasks', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Read book', done: false },
        { id: '2', title: 'Write code', done: false },
        { id: '3', title: 'Run tests', done: false }
      ]
      const result = deduplicateTasks(tasks)
      expect(result).toHaveLength(3)
    })
  })

  describe('makeSMART', () => {
    it('should add description if missing', () => {
      const task: GoalTask = { id: '1', title: 'Test task', done: false }
      const result = makeSMART(task)
      expect(result.description).toBeDefined()
      expect(result.description?.length).toBeGreaterThan(0)
    })

    it('should add acceptance criteria if missing', () => {
      const task: GoalTask = { id: '1', title: 'Test task', done: false }
      const result = makeSMART(task)
      expect(result.acceptanceCriteria).toBeDefined()
    })

    it('should add estimate if missing', () => {
      const task: GoalTask = { id: '1', title: 'Test task', done: false }
      const result = makeSMART(task)
      expect(result.week_estimate || result.day_estimate).toBeDefined()
    })

    it('should preserve existing properties', () => {
      const task: GoalTask = {
        id: '1',
        title: 'Test task',
        description: 'Existing description',
        acceptanceCriteria: 'Existing criteria',
        week_estimate: 3,
        done: false
      }
      const result = makeSMART(task)
      expect(result.description).toBe('Existing description')
      expect(result.acceptanceCriteria).toBe('Existing criteria')
      expect(result.week_estimate).toBe(3)
    })
  })

  describe('prioritizeTasks', () => {
    it('should assign high priority to first task', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'First task', done: false },
        { id: '2', title: 'Second task', done: false }
      ]
      const result = prioritizeTasks(tasks)
      expect(result[0].priority).toBe('high')
    })

    it('should assign priority based on urgent keywords', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Normal task', done: false },
        { id: '2', title: 'Срочная задача', done: false }
      ]
      const result = prioritizeTasks(tasks)
      expect(result[1].priority).toBe('high')
    })

    it('should consider deadline in context', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Task 1', done: false },
        { id: '2', title: 'Task 2', done: false }
      ]
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const context: GoalContext = {
        goalText: 'Test',
        deadline: tomorrow.toISOString()
      }
      const result = prioritizeTasks(tasks, context)
      expect(result[0].priority).toBe('high')
    })
  })

  describe('filterInvalidTasks', () => {
    it('should remove tasks with placeholder titles', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Valid task', done: false },
        { id: '2', title: 'Task 1', done: false },
        { id: '3', title: '...', done: false }
      ]
      const result = filterInvalidTasks(tasks)
      expect(result.length).toBeLessThan(tasks.length)
    })

    it('should remove tasks with too short titles', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'OK', done: false },
        { id: '2', title: 'AB', done: false },
        { id: '3', title: 'Valid task', done: false }
      ]
      const result = filterInvalidTasks(tasks)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Valid task')
    })
  })

  describe('postprocessTasks', () => {
    it('should apply full pipeline', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Valid task', done: false },
        { id: '2', title: 'Valid task', done: false },
        { id: '3', title: 'AB', done: false },
        { id: '4', title: 'Another task', done: false }
      ]
      const result = postprocessTasks(tasks)

      expect(result.length).toBeLessThan(tasks.length)

      result.forEach(task => {
        expect(task.description).toBeDefined()
        expect(task.acceptanceCriteria).toBeDefined()
        expect(task.priority).toBeDefined()
      })
    })

    it('should enhance tasks with context', () => {
      const tasks: GoalTask[] = [
        { id: '1', title: 'Test task', done: false }
      ]
      const context: GoalContext = {
        goalText: 'Test goal',
        tags: ['javascript', 'testing'],
        preferredDifficulty: 'easy'
      }
      const result = postprocessTasks(tasks, context)

      expect(result[0].description).toContain('javascript')
      expect(result[0].description).toContain('testing')
    })
  })
})

