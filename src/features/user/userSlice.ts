import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { auth } from '../../firebase'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { authService } from '../../services/authService'

export interface User {
  id: string
  email: string | null
  name: string | null
  photoURL: string | null
}

interface UserState {
  loading: boolean
  error: string | null
  me: User | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  loading: false,
  error: null,
  me: null,
  isAuthenticated: false,
}

const mapFirebaseUser = (user: FirebaseUser): User => ({
  id: user.uid,
  email: user.email ?? null,
  name: user.displayName ?? null,
  photoURL: user.photoURL ?? null,
})

const getErrorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

export const fetchMe = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'user/fetchMe',
  async (_, { rejectWithValue }) => {
    const current = auth.currentUser
    if (!current) return null
    try {
      return mapFirebaseUser(current)
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err) || 'Failed to map user')
    }
  }
)

export const updateMe = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  'user/updateMe',
  async (payload, { rejectWithValue }) => {
    const current = auth.currentUser
    if (!current) return rejectWithValue('No authenticated user')
    try {
      const toUpdate: { displayName?: string | null; photoURL?: string | null } = {}
      if (payload.name !== undefined) toUpdate.displayName = payload.name
      if (payload.photoURL !== undefined) toUpdate.photoURL = payload.photoURL
      if (Object.keys(toUpdate).length > 0) {
        await updateProfile(current, toUpdate)
      }
      return mapFirebaseUser(current)
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err) || 'Failed to update profile')
    }
  }
)

export const initAuth = createAsyncThunk('user/initAuth', async (_, { dispatch }) => {
  // Mock auth for Cypress E2E tests if no Firebase keys are present or just to bypass auth
  if ((window as any).Cypress) {
    console.log('E2E: Mocking auth initialization')
    const storedUser = localStorage.getItem('cypress_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        dispatch(setUser({
          id: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL
        }))
      } catch (e) {
        console.error('Failed to parse cypress_user', e)
      }
    }
    return
  }

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Auth initialization timeout'))
    }, 10000)

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        clearTimeout(timeout)
        if (currentUser) {
          dispatch(setUser(mapFirebaseUser(currentUser)))
        } else {
          dispatch(clearUser())
        }
        unsubscribe()
        resolve()
      },
      (error) => {
        clearTimeout(timeout)
        console.error('Auth state change error:', error)
        dispatch(clearUser())
        unsubscribe()
        reject(error)
      }
    )
  })
})

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err) || 'Failed to logout')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.me = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    clearUser(state) {
      state.me = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.me = action.payload
          state.isAuthenticated = true
        } else {
          state.me = null
          state.isAuthenticated = false
        }
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch user'
      })

      .addCase(updateMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.loading = false
        state.me = action.payload
        state.isAuthenticated = true
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Failed to update user'
      })

      .addCase(initAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(initAuth.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(initAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Auth init failed'
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.me = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Logout failed'
      })
  },
})

export const { setUser, clearUser, setLoading, setError } = userSlice.actions

export default userSlice.reducer
