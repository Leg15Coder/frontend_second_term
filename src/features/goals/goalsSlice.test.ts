import { describe, it, expect } from 'vitest'
import goalsReducer, { fetchGoals } from './goalsSlice'

describe('goals slice', () => {
  it('handles fetchGoals.fulfilled', () => {
    const initial = { items: [], loading: false, error: null }
    const sample = [{ id: 'g1', title: 'Goal 1', description: '', progress: 0, completed: false, createdAt: new Date().toISOString() }]
    const state = goalsReducer(initial as any, { type: fetchGoals.fulfilled.type, payload: sample } as any)
    expect(state.items.length).toBeGreaterThan(0)
    expect(state.loading).toBe(false)
  })
})
