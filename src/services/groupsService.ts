import type { Group } from '../types'

const storage = typeof window !== 'undefined' ? window.localStorage : null
const memory = new Map<string, string>()
const groupsKey = 'motify_groups'

function readGroups(): Group[] {
  const raw = storage?.getItem(groupsKey) ?? memory.get(groupsKey)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Group[]
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item })) : []
  } catch {
    return []
  }
}

function writeGroups(data: Group[]): Group[] {
  const payload = JSON.stringify(data)
  if (storage) storage.setItem(groupsKey, payload)
  else memory.set(groupsKey, payload)
  return data
}

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const groupsService = {
  async getGroups(): Promise<Group[]> {
    return readGroups()
  },

  async getGroupById(id: string): Promise<Group | null> {
    const groups = readGroups()
    return groups.find(g => g.id === id) || null
  },

  async createGroup(group: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    const list = readGroups()
    const next: Group = {
      ...group,
      id: randomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: group.members ?? [group.ownerId],
    }
    writeGroups([next, ...list])
    return next
  },

  async updateGroup(id: string, data: Partial<Group>): Promise<Group> {
    const list = readGroups()
    const index = list.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Group not found')
    const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() }
    list[index] = updated
    writeGroups(list)
    return updated
  },

  async deleteGroup(id: string): Promise<void> {
    const list = readGroups()
    writeGroups(list.filter((item) => item.id !== id))
  },

  async joinGroup(groupId: string, userId: string): Promise<Group> {
    const list = readGroups()
    const index = list.findIndex((item) => item.id === groupId)
    if (index === -1) throw new Error('Group not found')

    const group = list[index]
    const members = group.members ?? []

    if (members.includes(userId)) {
      return group
    }

    const updated = {
      ...group,
      members: [...members, userId],
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    writeGroups(list)
    return updated
  },

  async leaveGroup(groupId: string, userId: string): Promise<Group> {
    const list = readGroups()
    const index = list.findIndex((item) => item.id === groupId)
    if (index === -1) throw new Error('Group not found')

    const group = list[index]
    const members = group.members ?? []

    const updated = {
      ...group,
      members: members.filter((id) => id !== userId),
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    writeGroups(list)
    return updated
  },
}

