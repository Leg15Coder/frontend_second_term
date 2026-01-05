import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type { Analytics } from 'firebase/analytics'

function getConfig() {
  const cfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
  }

  const missing = Object.entries(cfg).filter(([, v]) => !v)
  if (missing.length > 0) {
    const msg = `Firebase configuration error: Missing keys: ${missing.map((m) => m[0]).join(', ')}`
    if (import.meta.env.PROD) {
      throw new Error(msg)
    } else {
      console.warn(msg)
    }
  }

  if (!import.meta.env.PROD) {
    console.log('Firebase Config:', {
      apiKey: cfg.apiKey ? `${cfg.apiKey.substring(0, 10)}...` : 'missing',
      authDomain: cfg.authDomain,
      projectId: cfg.projectId,
      appId: cfg.appId ? `${cfg.appId.substring(0, 20)}...` : 'missing'
    })
  }

  return cfg
}

const firebaseConfig = getConfig()
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)

export async function connectEmulators(): Promise<void> {
  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS !== 'true') return
  const authPort = Number(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT ?? 9099)
  const firestorePort = Number(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT ?? 8080)
  try {
    connectAuthEmulator(auth, `http://localhost:${authPort}`, { disableWarnings: true })
  } catch (err) {
    if (!import.meta.env.PROD) console.warn('connectAuthEmulator failed', err)
  }
  try {
    connectFirestoreEmulator(db, 'localhost', firestorePort)
  } catch (err) {
    if (!import.meta.env.PROD) console.warn('connectFirestoreEmulator failed', err)
  }
}

export async function initAnalytics(): Promise<Analytics | null> {
  if (!firebaseConfig.measurementId) return null
  if (typeof window === 'undefined') return null
  const supported = await isSupported().catch(() => false)
  if (!supported) return null
  try {
    const analytics = getAnalytics(app)
    return analytics
  } catch (err) {
    if (!import.meta.env.PROD) console.warn('initAnalytics failed', err)
    return null
  }
}

export default app
