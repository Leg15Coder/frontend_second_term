import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  checkActionCode,
  type User as FirebaseUser
} from 'firebase/auth'
import { auth } from '../firebase'
import { analytics } from '../lib/analytics'
import { checkFirebaseConfig, getFirebaseDebugInfo } from '../lib/firebase-check'

export const authService = {
  login: async (email: string, password: string): Promise<FirebaseUser> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking login', { email })
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
        emailVerified: false,
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
        console.warn('updateProfile skipped or failed:', err)
      }
    }

    try {
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/email-verified`,
        handleCodeInApp: false
      })
      console.log('Verification email sent to:', email)
    } catch (err) {
      console.error('Failed to send verification email:', err)
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

    try {
      console.log('Checking Firebase configuration...')
      const configCheck = await checkFirebaseConfig()

      if (!configCheck.success) {
        console.error('Firebase configuration invalid:', configCheck.error)
        throw new Error(`Ошибка конфигурации Firebase: ${configCheck.error}`)
      }

      console.log('Firebase debug info:', getFirebaseDebugInfo())
      console.log('Initializing Google OAuth...')

      const provider = new GoogleAuthProvider()

      provider.addScope('profile')
      provider.addScope('email')

      provider.setCustomParameters({
        prompt: 'select_account'
      })

      const isPlainHttp = window.location.protocol === 'http:'

      console.log('Protocol:', window.location.protocol)
      console.log('Using redirect method:', isPlainHttp)

      if (isPlainHttp) {
        console.log('Starting Google sign-in with redirect (http protocol)...')
        await signInWithRedirect(auth, provider)
        throw new Error('REDIRECT_IN_PROGRESS')
      } else {
        console.log('Opening Google sign-in popup (https)...')
        const userCredential = await signInWithPopup(auth, provider)
        console.log('Google sign-in successful:', userCredential.user.email)
        void analytics.trackEvent('login', { method: 'google' })
        return userCredential.user
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'REDIRECT_IN_PROGRESS') {
        throw error
      }

      console.error('Google login error:', error)

      const err = error as { code?: string; message?: string }

      if (err.code === 'auth/internal-error') {
        console.error('Internal error detected. Possible causes: Google API timeout, CORS, network issues.')
        throw new Error('Не удалось загрузить Google OAuth. Попробуйте: 1) Отключить блокировщики рекламы, 2) Проверить интернет-соединение, 3) Использовать другой браузер.')
      }

      if (err.code === 'auth/unauthorized-domain') {
        throw new Error(`Домен не авторизован. Добавьте "${window.location.hostname}" в Firebase Console: Authentication → Settings → Authorized domains`)
      }

      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Окно авторизации было закрыто. Попробуйте снова.')
      }

      if (err.code === 'auth/popup-blocked') {
        throw new Error('Браузер заблокировал всплывающее окно. Разрешите всплывающие окна для этого сайта.')
      }

      if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Запрос авторизации был отменен.')
      }

      if (err.code === 'auth/network-request-failed') {
        throw new Error('Ошибка сети. Проверьте подключение к интернету.')
      }

      throw error
    }
  },

  checkGoogleRedirectResult: async (): Promise<FirebaseUser | null> => {
    try {
      console.log('Checking for redirect result...')
      const result = await getRedirectResult(auth)

      if (result) {
        console.log('Google sign-in successful after redirect:', result.user.email)
        void analytics.trackEvent('login', { method: 'google' })
        return result.user
      }

      return null
    } catch (error: unknown) {
      console.error('Redirect result error:', error)
      const err = error as { code?: string; message?: string }

      if (err.code === 'auth/internal-error') {
        throw new Error('Не удалось завершить вход через Google. Попробуйте снова.')
      }

      throw error
    }
  },

  sendVerificationEmail: async (): Promise<void> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking sendVerificationEmail')
      return
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error('Пользователь не авторизован')
    }

    if (user.emailVerified) {
      throw new Error('Email уже подтвержден')
    }

    await sendEmailVerification(user, {
      url: `${window.location.origin}/email-verified`,
      handleCodeInApp: false
    })

    console.log('Verification email sent to:', user.email)
  },

  verifyEmailCode: async (code: string): Promise<void> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking verifyEmailCode')
      return
    }

    try {
      await checkActionCode(auth, code)
      await applyActionCode(auth, code)

      if (auth.currentUser) {
        await auth.currentUser.reload()
      }

      console.log('Email verified successfully')
      void analytics.trackEvent('email_verified')
    } catch (error: unknown) {
      console.error('Email verification error:', error)
      const err = error as { code?: string }

      if (err.code === 'auth/invalid-action-code') {
        throw new Error('Неверный или истекший код подтверждения')
      }

      if (err.code === 'auth/expired-action-code') {
        throw new Error('Код подтверждения истек. Запросите новое письмо.')
      }

      throw error
    }
  },

  checkEmailVerified: async (): Promise<boolean> => {
    if ((window as any).Cypress) {
      return true
    }

    const user = auth.currentUser
    if (!user) {
      return false
    }

    await user.reload()
    return user.emailVerified
  },

  deleteAccount: async (): Promise<void> => {
    if ((window as any).Cypress) {
      console.log('E2E: Mocking deleteAccount')
      return
    }
    const user = auth.currentUser
    if (user) {
      await user.delete()
    }
  }
}
