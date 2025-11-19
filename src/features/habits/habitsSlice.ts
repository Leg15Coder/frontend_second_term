import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../app/api'
import type {Habit} from '../../types'

interface HabitsState {
  items: Habit[]
  loading: boolean
  error?: string | null
}

const initialState: HabitsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchHabits = createAsyncThunk('habits/fetchAll', async () => {
  const res = await api.get<Habit[]>('/habits')
  return res.data
})

export const addHabit = createAsyncThunk('habits/add', async (payload: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
  const res = await api.post<Habit>('/habits', payload)
  return res.data
})

export const toggleHabit = createAsyncThunk('habits/toggle', async (id: string) => {
  const res = await api.patch<Habit>(`/habits/${id}/toggle`)
  return res.data
})

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHabits.fulfilled, (state, action: PayloadAction<Habit[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch habits'
      })
      .addCase(addHabit.fulfilled, (state, action: PayloadAction<Habit>) => {
        state.items.push(action.payload)
      })
      .addCase(toggleHabit.fulfilled, (state, action: PayloadAction<Habit>) => {
        const idx = state.items.findIndex((h) => h.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
  },
})

export default habitsSlice.reducer
