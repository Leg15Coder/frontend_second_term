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
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    void analytics.trackEvent('login', { method: 'email' })
    return userCredential.user
  },

  register: async (email: string, password: string, name?: string): Promise<FirebaseUser> => {
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
    await signOut(auth)
  },

  googleLogin: async (): Promise<FirebaseUser> => {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    void analytics.trackEvent('login', { method: 'google' })
    return userCredential.user
  }
}
