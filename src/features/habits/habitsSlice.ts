import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../app/api'
import type { Habit } from '../../types'

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

export const fetchHabits = createAsyncThunk<Habit[]>('habits/fetch', async () => {
  const res = await api.get<Habit[]>('/api/habits')
  return res.data
})

export const createHabit = createAsyncThunk<Habit, Partial<Habit>>('habits/create', async (payload) => {
  const res = await api.post<Habit>('/api/habits', payload)
  return res.data
})

export const updateHabit = createAsyncThunk<Habit, { id: string; data: Partial<Habit> }>(
  'habits/update',
  async ({ id, data }) => {
    const res = await api.patch<Habit>(`/api/habits/${id}`, data)
    return res.data
  }
)

export const deleteHabit = createAsyncThunk<string, string>('habits/delete', async (id) => {
  await api.delete(`/api/habits/${id}`)
  return id
})

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
  },
})

export const { toggleLocalComplete } = slice.actions
export default slice.reducer
