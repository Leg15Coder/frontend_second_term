import { describe, it, expect } from 'vitest'
import { store } from '../../app/store'
import { fetchHabits } from './habitsSlice'

describe('habits slice', () => {
  it('fetches habits from API', async () => {
    await store.dispatch(fetchHabits())
    const state = store.getState().habits
    expect(state.items.length).toBeGreaterThan(0)
    expect(state.loading).toBe(false)
  })
})

