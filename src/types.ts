export interface Habit {
  id: string
  title: string
  description?: string
  completed: boolean
  streak?: number
  createdAt: string
  updatedAt?: string
  userId?: string
  datesCompleted?: string[]
  frequency?: 'daily' | 'weekdays' | 'custom'
  customDays?: number[]
  difficulty?: 'low' | 'medium' | 'hard'
}

export interface GoalTask {
  id: string
  title: string
  description?: string
  week_estimate?: number
  day_estimate?: number
  acceptanceCriteria?: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  description?: string
  progress: number
  completed: boolean
  createdAt: string
  updatedAt?: string
  tasks?: GoalTask[]
  detailedDescription?: string
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
  description?: string
  days: number
  startDate?: string
  participants?: string[]
  dailyChecks?: Record<string, string[]>
  createdAt: string
  updatedAt?: string
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

export interface Todo {
  id: string
  title: string
  description?: string
  deadline?: string
  completed: boolean
  createdAt: string
  updatedAt?: string
  userId?: string
}

export interface TodosState {
  items: Todo[]
  loading: boolean
  error: string | null
}
