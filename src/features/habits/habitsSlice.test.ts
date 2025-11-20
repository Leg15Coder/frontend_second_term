import { describe, it, expect } from 'vitest'
import habitsReducer, { fetchHabits } from './habitsSlice'
import type { Habit } from '../../types'

describe('habits slice reducer', () => {
  it('handles fetchHabits.fulfilled', () => {
    const initial = { items: [], loading: false, error: null }
    const sample: Habit[] = [
      { id: '1', title: 'H1', completed: false, streak: 0, createdAt: new Date().toISOString() },
    ]
    const action = { type: fetchHabits.fulfilled.type, payload: sample }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = habitsReducer(initial as any, action as any)
    expect(state.items.length).toBe(1)
    expect(state.loading).toBe(false)
  })
})
