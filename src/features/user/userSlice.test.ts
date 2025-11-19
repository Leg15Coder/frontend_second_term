import { describe, it, expect } from 'vitest'
import { store } from '../../app/store'
import { fetchMe } from './userSlice'

describe('user slice', () => {
  it('fetches current user', async () => {
    await store.dispatch(fetchMe())
    const state = store.getState().user
    expect(state.me).toBeDefined()
    expect(state.loading).toBe(false)
  })
})

