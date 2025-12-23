import { describe, it, expect, vi } from 'vitest'
import { authService } from '../../src/services/authService'

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual<any>('firebase/auth')
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'u1' } }),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'u2' } }),
    signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'u3' } }),
  }
})

describe('authService', () => {
  it('login should return user', async () => {
    const user = await authService.login('a@a.com', 'pass')
    expect(user).toHaveProperty('uid')
  })

  it('register should return user', async () => {
    const user = await authService.register('b@b.com', 'pass', 'Name')
    expect(user).toHaveProperty('uid')
  })

  it('googleLogin should return user', async () => {
    const user = await authService.googleLogin()
    expect(user).toHaveProperty('uid')
  })
})

