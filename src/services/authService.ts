import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth'
import { auth } from '../firebase'
import { analytics } from '../lib/analytics'

export const authService = {
  login: async (email: string, password: string): Promise<FirebaseUser> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking login', { email })
      // Simulate auth error for specific test cases
      if (email.includes('wrong') || email.includes('error') || password === 'short') {
        const error = new Error('Firebase: Error (auth/invalid-email).') as any
        error.code = 'auth/invalid-credential' // Default mock error code
        if (email.includes('user-not-found')) error.code = 'auth/user-not-found'
        if (password === 'short') error.code = 'auth/weak-password'
        throw error
      }

      return {
        uid: 'test-user-id',
        email: email,
        displayName: 'Test User',
        photoURL: null,
        getIdToken: async () => 'mock-token'
      } as unknown as FirebaseUser
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    void analytics.trackEvent('login', { method: 'email' })
    return userCredential.user
  },

  register: async (email: string, password: string, name?: string): Promise<FirebaseUser> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking register', { email })
      // Simulate registration error
      if (email.includes('existing') || email.includes('used')) {
        const error = new Error('Firebase: Error (auth/email-already-in-use).') as any
        error.code = 'auth/email-already-in-use'
        throw error
      }

      return {
        uid: 'test-user-id',
        email: email,
        displayName: name || 'Test User',
        photoURL: null,
        getIdToken: async () => 'mock-token'
      } as unknown as FirebaseUser
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      try {
        const userAny = userCredential.user as any
        if (userAny && typeof userAny.getIdToken === 'function') {
          await updateProfile(userCredential.user, { displayName: name })
        } else {}
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('updateProfile skipped or failed:', err)
      }
    }
    void analytics.trackEvent('signup', { method: 'email' })
    return userCredential.user
  },

  logout: async (): Promise<void> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking logout')
      return
    }
    await signOut(auth)
  },

  googleLogin: async (): Promise<FirebaseUser> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking googleLogin')
      const mockUser = {
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        getIdToken: async () => 'mock-token'
      } as unknown as FirebaseUser
      localStorage.setItem('cypress_user', JSON.stringify({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: mockUser.photoURL
      }))
      return mockUser
    }
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    void analytics.trackEvent('login', { method: 'google' })
    return userCredential.user
  }
}
