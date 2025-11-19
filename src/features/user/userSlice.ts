import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../../app/api'
import type { User } from '../../types'

interface UserState {
  me?: User | null
  loading: boolean
  error?: string | null
}

const initialState: UserState = {
  me: null,
  loading: false,
  error: null,
}

export const fetchMe = createAsyncThunk('user/fetchMe', async () => {
  const res = await api.get<User>('/me')
  return res.data
})

export const updateMe = createAsyncThunk('user/updateMe', async (payload: Partial<User>) => {
  const res = await api.patch<User>('/me', payload)
  return res.data
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.me = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.me = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch user'
      })
      .addCase(updateMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.me = action.payload
      })
  },
})

export const { logout } = userSlice.actions

export default userSlice.reducer
