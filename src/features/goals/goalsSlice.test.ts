import { describe, it, expect } from 'vitest'
import goalsReducer, { fetchGoals } from './goalsSlice'
import type { GoalsState } from '../../types'

describe('goals slice', () => {
  it('handles fetchGoals.fulfilled', () => {
    const initial: GoalsState = { items: [], loading: false, error: null }
    const sample = [{ id: 'g1', title: 'Goal 1', detailedDescription: '', progress: 0, completed: false, createdAt: new Date().toISOString() }]
    const state = goalsReducer(initial, { type: fetchGoals.fulfilled.type, payload: sample })
    expect(state.items.length).toBeGreaterThan(0)
    expect(state.loading).toBe(false)
  })
})
