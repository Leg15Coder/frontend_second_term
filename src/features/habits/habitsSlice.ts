import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { habitsService } from '@/services/habitsService'
import type { Habit } from '@/types'
import { auth } from '@/firebase'
import { analytics } from '../../lib/analytics'

type State = {
  items: Habit[]
  loading: boolean
  error: string | null
}

const initialState: State = {
  items: [],
  loading: false,
  error: null,
}

export const fetchHabits = createAsyncThunk<Habit[], string | undefined, {}>(
  'habits/fetch',
  async (userId) => {
    if (!userId) {
      const currentUserId = auth.currentUser?.uid
      if (!currentUserId) return []
      return await habitsService.getHabits(currentUserId)
    }
    return await habitsService.getHabits(userId)
  }
)

export const createHabit = createAsyncThunk<
  Habit,
  Omit<Habit, 'id' | 'createdAt' | 'userId'>
>('habits/create', async (payload) => {
  const userId = auth.currentUser?.uid
  if (!userId) throw new Error('Not authenticated')
  const toCreate = { ...payload, userId }
  const created = await habitsService.addHabit(toCreate)
  void analytics.trackEvent('create_habit', { habitId: created.id })
  return created
})

export const updateHabit = createAsyncThunk<Habit, { id: string; data: Partial<Habit> }>(
  'habits/update',
  async ({ id, data }) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')
    return await habitsService.updateHabit(id, { ...data, userId })
  }
)

export const deleteHabit = createAsyncThunk<string, string>('habits/delete', async (id) => {
  const userId = auth.currentUser?.uid
  if (!userId) throw new Error('Not authenticated')
  await habitsService.deleteHabit(id, userId)
  return id
})

export const checkInHabit = createAsyncThunk<{ id: string; date: string }, { id: string; date: string }>(
  'habits/checkIn',
  async ({ id, date }) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')
    await habitsService.checkInHabit(id, date, userId)
    return { id, date }
  }
)

const slice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    toggleLocalComplete(state, action: PayloadAction<string>) {
      const id = action.payload
      const item = state.items.find((h) => h.id === id)
      if (item) item.completed = !item.completed
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch'
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        const idx = state.items.findIndex((h) => h.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.items = state.items.filter((h) => h.id !== action.payload)
      })
      .addCase(checkInHabit.fulfilled, (state, action) => {
        const { id, date } = action.payload
        const item = state.items.find((h) => h.id === id)
        if (item) {
          item.datesCompleted ??= []
          if (!item.datesCompleted.includes(date)) item.datesCompleted.push(date)
        }
      })
  },
})

export const { toggleLocalComplete } = slice.actions
export default slice.reducer
