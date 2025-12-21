import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Group, GroupsState } from '@/types'
import { groupsService } from '@/services/groupsService'
import { auth } from '@/firebase'

const initialState: GroupsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchGroups = createAsyncThunk<Group[], void, { rejectValue: string }>(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      return await groupsService.getGroups()
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch groups')
    }
  }
)

export const createGroup = createAsyncThunk<Group, Omit<Group, 'id' | 'createdAt' | 'ownerId'>, { rejectValue: string }>(
  'groups/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) throw new Error('Not authenticated')

      return await groupsService.createGroup({
        ...groupData,
        ownerId: userId,
      })
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to create group')
    }
  }
)

export const updateGroup = createAsyncThunk<Group, { id: string; data: Partial<Group> }, { rejectValue: string }>(
  'groups/updateGroup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await groupsService.updateGroup(id, data)
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to update group')
    }
  }
)

export const deleteGroup = createAsyncThunk<string, string, { rejectValue: string }>(
  'groups/deleteGroup',
  async (id, { rejectWithValue }) => {
    try {
      await groupsService.deleteGroup(id)
      return id
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to delete group')
    }
  }
)

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearGroupsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to fetch groups'
      })

      .addCase(createGroup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to create group'
      })

      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update group'
      })

      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete group'
      })
  },
})

export const { clearGroupsError } = groupsSlice.actions

export default groupsSlice.reducer

