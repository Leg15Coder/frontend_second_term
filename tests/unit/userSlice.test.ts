import { describe, it, expect } from 'vitest'
import userReducer, { setUser, clearUser, setLoading, setError } from '../../src/features/user/userSlice'

describe('userSlice reducers', () => {
  it('setUser sets me and isAuthenticated', () => {
    const prev = { loading: false, error: null, me: null, isAuthenticated: false }
    const next = userReducer(prev, setUser({ id: '1', email: 'a@a.com', name: 'A', photoURL: null }))
    expect(next.me).not.toBeNull()
    expect(next.isAuthenticated).toBe(true)
  })
  it('clearUser clears state', () => {
    const prev = { loading: false, error: null, me: { id: '1', email: 'a@a.com', name: 'A', photoURL: null }, isAuthenticated: true }
    const next = userReducer(prev, clearUser())
    expect(next.me).toBeNull()
    expect(next.isAuthenticated).toBe(false)
  })
})

