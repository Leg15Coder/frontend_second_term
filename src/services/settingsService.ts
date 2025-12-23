export interface UserSettings {
  displayName?: string
  photoURL?: string
  notifications: boolean
  theme: 'light' | 'dark'
  profileVisibility: 'public' | 'private'
}

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()

const settingsKey = (userId: string) => `motify_settings_${userId}`

function readSettings(userId: string): UserSettings | null {
  if (!userId) return null
  const key = settingsKey(userId)
  const raw = storage?.getItem(key) ?? memory.get(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserSettings
  } catch {
    return null
  }
}

function writeSettings(userId: string, settings: UserSettings): UserSettings {
  if (!userId) return settings
  const key = settingsKey(userId)
  const payload = JSON.stringify(settings)
  if (storage) storage.setItem(key, payload)
  else memory.set(key, payload)
  return settings
}

const defaultSettings: UserSettings = {
  notifications: true,
  theme: 'dark',
  profileVisibility: 'public',
}

export const settingsService = {
  async getSettings(userId: string): Promise<UserSettings> {
    return readSettings(userId) ?? defaultSettings
  },

  async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
    const current = readSettings(userId) ?? defaultSettings
    const updated = { ...current, ...settings }
    writeSettings(userId, updated)
    return updated
  },

  async deleteAccount(userId: string): Promise<void> {
    if (!userId) return

    const { auth } = await import('../firebase')
    const { deleteUser } = await import('firebase/auth')
    const { collection, query, where, getDocs, deleteDoc } = await import('firebase/firestore')
    const { db } = await import('../firebase')

    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user')
    }

    if (currentUser.uid !== userId) {
      throw new Error('User ID mismatch')
    }

    try {
      const collections = ['habits', 'goals', 'todos', 'challenges', 'settings']

      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where('userId', '==', userId))
        const snapshot = await getDocs(q)
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)
      }

      await deleteUser(currentUser)

      const keysToRemove = [
        settingsKey(userId),
        `motify_habits_${userId}`,
        `motify_goals_${userId}`,
        `motify_todos_${userId}`,
        'motify_challenges',
        'motify_groups',
      ]

      keysToRemove.forEach((key) => {
        if (storage) storage.removeItem(key)
        else memory.delete(key)
      })

    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/requires-recent-login') {
        const recentLoginError = new Error('Для удаления аккаунта требуется повторный вход')
        ;(recentLoginError as { code?: string }).code = 'auth/requires-recent-login'
        throw recentLoginError
      }
      throw error
    }
  },

  async reauthenticate(email: string, password: string): Promise<void> {
    const { auth } = await import('../firebase')
    const { reauthenticateWithCredential, EmailAuthProvider } = await import('firebase/auth')

    const currentUser = auth.currentUser
    if (!currentUser?.email) {
      throw new Error('No authenticated user')
    }

    const credential = EmailAuthProvider.credential(email, password)
    await reauthenticateWithCredential(currentUser, credential)
  },
}

