import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Challenge } from '../../types'
import { challengesService } from '../../services/challengesService'

interface ChallengesState {
  items: Challenge[]
  loading: boolean
  error: string | null
}

const initialState: ChallengesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchChallenges = createAsyncThunk<Challenge[], void, { rejectValue: string }>(
  'challenges/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      return await challengesService.getChallenges()
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch challenges')
    }
  }
)

export const createChallenge = createAsyncThunk<Challenge, Omit<Challenge, 'id' | 'createdAt'>, { rejectValue: string }>(
  'challenges/createChallenge',
  async (challenge, { rejectWithValue }) => {
    try {
      return await challengesService.addChallenge(challenge)
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to create challenge')
    }
  }
)

export const joinChallenge = createAsyncThunk<Challenge, { challengeId: string; userId: string }, { rejectValue: string }>(
  'challenges/joinChallenge',
  async ({ challengeId, userId }, { rejectWithValue }) => {
    try {
      return await challengesService.joinChallenge(challengeId, userId)
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to join challenge')
    }
  }
)

export const leaveChallenge = createAsyncThunk<Challenge, { challengeId: string; userId: string }, { rejectValue: string }>(
  'challenges/leaveChallenge',
  async ({ challengeId, userId }, { rejectWithValue }) => {
    try {
      return await challengesService.leaveChallenge(challengeId, userId)
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to leave challenge')
    }
  }
)

export const checkInChallenge = createAsyncThunk<Challenge, { challengeId: string; userId: string; date?: string }, { rejectValue: string }>(
  'challenges/checkInChallenge',
  async ({ challengeId, userId, date }, { rejectWithValue }) => {
    try {
      return await challengesService.checkInChallenge(challengeId, userId, date)
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to check in challenge')
    }
  }
)

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    clearChallengesError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to fetch challenges'
      })

      .addCase(createChallenge.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to create challenge'
      })

      .addCase(joinChallenge.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(joinChallenge.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to join challenge'
      })

      .addCase(leaveChallenge.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(leaveChallenge.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to leave challenge'
      })

      .addCase(checkInChallenge.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(checkInChallenge.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to check in challenge'
      })
  },
})

export const { clearChallengesError } = challengesSlice.actions

export default challengesSlice.reducer

