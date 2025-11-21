import { describe, it, expect } from 'vitest'
import habitsReducer, { fetchHabits } from './habitsSlice'
import type { Habit, HabitsState } from '../../types'

describe('habits slice reducer', () => {
  it('handles fetchHabits.fulfilled', () => {
    const initial: HabitsState = { items: [], loading: false, error: null }
    const sample: Habit[] = [
      { id: '1', title: 'H1', completed: false, streak: 0, createdAt: new Date().toISOString() },
    ]
    const action = { type: fetchHabits.fulfilled.type, payload: sample }
    const state = habitsReducer(initial, action)
    expect(state.items.length).toBe(1)
    expect(state.loading).toBe(false)
  })
})
