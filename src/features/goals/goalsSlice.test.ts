import { describe, it, expect } from 'vitest'
import { store } from '../../app/store'
import { fetchGoals } from './goalsSlice'

describe('goals slice', () => {
  it('fetches goals from API', async () => {
    await store.dispatch(fetchGoals())
    const state = store.getState().goals
    expect(state.items.length).toBeGreaterThan(0)
    expect(state.loading).toBe(false)
  })
})

