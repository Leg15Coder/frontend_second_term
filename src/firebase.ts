import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import type { FirebaseStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const FALLBACK_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
}

function getConfig() {
  const cfg = {
    apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || FALLBACK_CONFIG.apiKey,
    authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || FALLBACK_CONFIG.authDomain,
    projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || FALLBACK_CONFIG.projectId,
    storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || FALLBACK_CONFIG.storageBucket,
    messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || FALLBACK_CONFIG.messagingSenderId,
    appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || FALLBACK_CONFIG.appId,
    measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string) || FALLBACK_CONFIG.measurementId,
  }

  if (import.meta.env.DEV) {
    const missing = Object.entries(cfg).filter(([, v]) => !v)
    if (missing.length) {
      console.warn(
        'Firebase: missing configuration keys. Add real values to .env.local (VITE_FIREBASE_*) — missing:',
        missing.map((m) => m[0]).join(', ')
      )
    }
  }

  return cfg
}

const firebaseConfig = getConfig()
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

try {
  _auth = getAuth(app)
} catch (err) {
  console.warn('Firebase auth init failed:', err)
}

try {
  _db = getFirestore(app)
} catch (err) {
  console.warn('Firebase firestore init failed:', err)
}

try {
  _storage = getStorage(app)
} catch (err) {
  console.warn('Firebase storage init failed:', err)
}

export function getAuthSafe() {
  return _auth
}

export function getDbSafe() {
  return _db
}

export function getStorageSafe() {
  return _storage
}

export async function initAnalytics() {
  try {
    if (await isSupported()) {
      return getAnalytics(app)
    }
  } catch (error) {
    console.warn('Firebase analytics initialization failed:', error)
    return null
  }
  return null
}

export function connectEmulators() {
  const useEmu = (import.meta.env.VITE_USE_FIREBASE_EMULATORS as string) === 'true'
  if (!useEmu) return

  try {
    const authHost = (import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST as string) || 'http://localhost:9099'
    const firestoreHost = (import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST as string) || 'localhost'
    const firestorePort = Number(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT || '8080')
    const storageHost = (import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_HOST as string) || 'localhost'
    const storagePort = Number(import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_PORT || '9199')

    const a = _auth
    const d = _db
    const s = _storage
    if (a) connectAuthEmulator(a, authHost, { disableWarnings: true })
    if (d) connectFirestoreEmulator(d, firestoreHost, firestorePort)
    if (s) connectStorageEmulator(s, storageHost, storagePort)
    console.info('Firebase emulators connected')
  } catch (err) {
    console.warn('Failed to connect Firebase emulators', err)
  }
}
