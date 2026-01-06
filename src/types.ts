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
  frequency?: 'daily' | 'weekdays' | 'custom' | 'every_n_days'
  customDays?: number[]
  everyNDays?: number
  difficulty?: 'low' | 'medium' | 'hard'
  completionHistory?: HabitCompletion[]
  status?: 'suggested' | 'active' | 'completed' | 'rejected'
  source?: 'user' | 'ai'
  linkedGoalId?: string
  confidence?: number
}

export interface HabitCompletion {
  id: string
  date: string
  completed: boolean
  note?: string
}

export interface GoalTask {
  id: string
  title: string
  description?: string
  week_estimate?: number
  day_estimate?: number
  acceptanceCriteria?: string
  done: boolean
  parentId?: string | null
  childTasks?: GoalTask[]
  order?: number
}

export interface Goal {
  id: string
  title: string
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
  isPublic?: boolean
  bio?: string
  friends?: string[]
  friendRequests?: string[]
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
  mode?: 'cumulative' | 'streak'
  lastResetDate?: string
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
  pending: Record<string, number>;
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
  difficulty?: 'low' | 'medium' | 'high'
}

export interface TodosState {
  items: Todo[]
  loading: boolean
  error: string | null
}

export interface Group {
  id: string
  name: string
  description?: string
  isPublic: boolean
  ownerId: string
  members?: string[]
  createdAt: string
  updatedAt?: string
  coverImage?: string
}

export interface GroupsState {
  items: Group[]
  loading: boolean
  error: string | null
}

export interface GroupChallenge {
  id: string
  groupId: string
  title: string
  description?: string
  days: number
  startDate?: string
  participants?: string[]
  dailyChecks?: Record<string, string[]>
  createdAt: string
  updatedAt?: string
  mode?: 'cumulative' | 'streak'
  lastResetDate?: string
}

export interface FriendRequest {
  id: string
  from: string
  to: string
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected'
}
