import type { User } from '../types'

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const usersKey = 'motify_users'

function readUsers(): User[] {
  const raw = storage?.getItem(usersKey) ?? memory.get(usersKey)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as User[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(data: User[]): void {
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(usersKey, payload)
  else memory.set(usersKey, payload)
}

export const userService = {
  async getUser(userId: string): Promise<User | null> {
    const users = readUsers()
    return users.find(u => u.id === userId) || null
  },

  async addFriend(userId: string, friendId: string): Promise<void> {
    const users = readUsers()
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) return

    const user = users[userIndex]
    const friends = user.friends ?? []

    if (!friends.includes(friendId)) {
      users[userIndex] = {
        ...user,
        friends: [...friends, friendId],
        updatedAt: new Date().toISOString()
      }
      writeUsers(users)
    }
  },

  async removeFriend(userId: string, friendId: string): Promise<void> {
    const users = readUsers()
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) return

    const user = users[userIndex]
    const friends = user.friends ?? []

    users[userIndex] = {
      ...user,
      friends: friends.filter(id => id !== friendId),
      updatedAt: new Date().toISOString()
    }
    writeUsers(users)
  },

  async getUsers(): Promise<User[]> {
    return readUsers()
  },

  async searchUsers(query: string): Promise<User[]> {
    const users = readUsers()
    const searchLower = query.toLowerCase().trim()

    if (!searchLower) return users.filter(u => u.isPublic !== false)

    return users.filter(u => {
      const nameMatch = typeof u.name === 'string' ? u.name.toLowerCase().includes(searchLower) : false
      const emailMatch = typeof u.email === 'string' ? u.email.toLowerCase().includes(searchLower) : false
      const isPublicUser = u.isPublic !== false
      return (nameMatch || emailMatch) && isPublicUser
    })
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const users = readUsers()
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) throw new Error('User not found')

    const user = users[userIndex]
    const updated = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString()
    }

    users[userIndex] = updated
    writeUsers(users)
    return updated
  }
}
