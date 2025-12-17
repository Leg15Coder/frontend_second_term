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

    const keysToRemove = [
      settingsKey(userId),
      `motify_habits_${userId}`,
      `motify_goals_${userId}`,
    ]

    keysToRemove.forEach((key) => {
      if (storage) storage.removeItem(key)
      else memory.delete(key)
    })
  },
}

