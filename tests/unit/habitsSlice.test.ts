import { describe, it, expect } from 'vitest'
import habitsReducer, { toggleLocalComplete } from '../../src/features/habits/habitsSlice'

describe('habitsSlice reducers', () => {
  it('toggleLocalComplete toggles completed', () => {
    const prev = { items: [{ id: 'h1', title: 'T', completed: false, createdAt: new Date().toISOString() }], loading: false, error: null, pending: {} }
    const next = habitsReducer(prev, toggleLocalComplete('h1'))
    expect(next.items[0].completed).toBe(true)
  })
})
