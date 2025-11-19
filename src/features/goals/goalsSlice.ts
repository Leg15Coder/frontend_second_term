import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../../app/api'
import type { Goal } from '../../types'

interface GoalsState {
  items: Goal[]
  loading: boolean
  error?: string | null
}

const initialState: GoalsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchGoals = createAsyncThunk('goals/fetchAll', async () => {
  const res = await api.get<Goal[]>('/goals')
  return res.data
})

export const addGoal = createAsyncThunk('goals/add', async (payload: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
  const res = await api.post<Goal>('/goals', payload)
  return res.data
})

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch goals'
      })
      .addCase(addGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.items.push(action.payload)
      })
  },
})

export default goalsSlice.reducer
