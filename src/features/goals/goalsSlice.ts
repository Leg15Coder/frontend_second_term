import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Goal } from '../../types'
import { goalsService } from '../../services/goalsService'
import { auth } from '../../firebase'

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

export const fetchGoals = createAsyncThunk<Goal[], string | undefined, {}>(
  'goals/fetchAll',
  async (userId) => {
    if (!userId) {
      const currentUserId = auth.currentUser?.uid
      if (!currentUserId) return []
      return await goalsService.getGoals(currentUserId)
    }
    return await goalsService.getGoals(userId)
  }
)

export const addGoal = createAsyncThunk('goals/add', async (payload: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
  const userId = auth.currentUser?.uid
  if (!userId) throw new Error('Not authenticated')
  const toCreate: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> & { userId: string } = { ...payload, userId }
  return await goalsService.addGoal(toCreate)
})

export const updateGoal = createAsyncThunk<Goal, { id: string; data: Partial<Goal> & { userId?: string } }>(
  'goals/update',
  async ({ id, data }) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')
    return await goalsService.updateGoal(id, { ...data, userId })
  }
)

export const deleteGoal = createAsyncThunk<string, string>(
  'goals/delete',
  async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')
    await goalsService.deleteGoal(id, userId)
    return id
  }
)

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
        state.items.unshift(action.payload)
      })
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((g) => g.id !== action.payload)
      })
  },
})

export default goalsSlice.reducer
