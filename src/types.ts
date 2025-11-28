export interface Habit {
  id: string
  title: string
  description?: string
  completed: boolean
  streak?: number
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
  email?: string
  avatar?: string
  updatedAt?: string
  createdAt: string
}

export interface Challenge {
  id: string
  title: string
  daysTotal: number
  daysCompleted: number
  description?: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  read: boolean
  createdAt: string
}

export interface HabitsState {
  items: Habit[];
  loading: boolean;
  error: string | null;
}

export interface GoalsState {
  items: Goal[];
  loading: boolean;
  error: string | null;
}
