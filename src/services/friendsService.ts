interface FriendRequest {
  id: string
  from: string
  to: string
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const requestsKey = 'motify_friend_requests'

function readRequests(): FriendRequest[] {
  const raw = storage?.getItem(requestsKey) ?? memory.get(requestsKey)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as FriendRequest[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRequests(data: FriendRequest[]): void {
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(requestsKey, payload)
  else memory.set(requestsKey, payload)
}

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const friendsService = {
  async sendRequest(from: string, to: string): Promise<FriendRequest> {
    const requests = readRequests()

    const existing = requests.find(r =>
      (r.from === from && r.to === to && r.status === 'pending') ||
      (r.from === to && r.to === from && r.status === 'pending')
    )

    if (existing) {
      throw new Error('Запрос уже отправлен')
    }

    const request: FriendRequest = {
      id: randomId(),
      from,
      to,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    writeRequests([...requests, request])
    return request
  },

  async acceptRequest(requestId: string, userId: string): Promise<void> {
    const requests = readRequests()
    const request = requests.find(r => r.id === requestId)

    if (!request) throw new Error('Запрос не найден')
    if (request.to !== userId) throw new Error('Нет прав принять этот запрос')

    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    )
    writeRequests(updatedRequests)

    const userService = await import('./userService')
    await userService.userService.addFriend(request.from, request.to)
    await userService.userService.addFriend(request.to, request.from)
  },

  async rejectRequest(requestId: string, userId: string): Promise<void> {
    const requests = readRequests()
    const request = requests.find(r => r.id === requestId)

    if (!request) throw new Error('Запрос не найден')
    if (request.to !== userId) throw new Error('Нет прав отклонить этот запрос')

    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    )
    writeRequests(updatedRequests)
  },

  async removeFriend(userId: string, friendId: string): Promise<void> {
    const userService = await import('./userService')
    await userService.userService.removeFriend(userId, friendId)
    await userService.userService.removeFriend(friendId, userId)
  },

  async getFriends(userId: string): Promise<string[]> {
    const userService = await import('./userService')
    const user = await userService.userService.getUser(userId)
    return user?.friends ?? []
  },

  async getRequests(userId: string): Promise<FriendRequest[]> {
    const requests = readRequests()
    return requests.filter(r => r.to === userId && r.status === 'pending')
  },

  async getSentRequests(userId: string): Promise<FriendRequest[]> {
    const requests = readRequests()
    return requests.filter(r => r.from === userId && r.status === 'pending')
  }
}

