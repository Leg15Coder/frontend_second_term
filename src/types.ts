export interface Habit {
  id: string
  title: string
  description?: string
  completed: boolean
  streak: number
  createdAt: string
  updatedAt?: string
}

export interface Goal {
  id: string
  title: string
  description?: string
  progress: number
  completed: boolean
  createdAt: string
  updatedAt?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
  updatedAt?: string
}

