import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { habitsService } from '@/services/habitsService'
import type { Habit } from '@/types'
import { auth } from '@/firebase'
import { analytics } from '../../lib/analytics'

type State = {
  items: Habit[]
  loading: boolean
  error: string | null
  pending: Record<string, number>
}

const initialState: State = {
  items: [],
  loading: false,
  error: null,
  pending: {},
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

export const checkInHabit = createAsyncThunk<Habit, { id: string; date: string }>(
  'habits/checkIn',
  async ({ id, date }) => {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error('Not authenticated')
    const updated = await habitsService.checkInHabit(id, date, userId)
    return updated
  }
)

const slice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    toggleLocalComplete(state, action: PayloadAction<string>) {
      const id = action.payload
      const item = state.items.find((h) => h.id === id)
      if (!item) return
      const today = new Date().toISOString().split('T')[0]
      const dates = new Set(item.datesCompleted ?? [])
      if (dates.has(today)) {
        dates.delete(today)
      } else {
        dates.add(today)
      }
      item.datesCompleted = Array.from(dates)
      item.completed = dates.size > 0
      item.updatedAt = new Date().toISOString()
      state.pending[id] = Date.now()
    },
    applyLocalCheckIn(state, action: PayloadAction<{ id: string; date: string }>) {
      const { id, date } = action.payload
      const item = state.items.find((h) => h.id === id)
      if (!item) return
      const dates = new Set(item.datesCompleted ?? [])
      if (dates.has(date)) {
        dates.delete(date)
      } else {
        dates.add(date)
      }
      item.datesCompleted = Array.from(dates)
      item.completed = dates.size > 0
      item.updatedAt = new Date().toISOString()
      state.pending[id] = Date.now()
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
        const incoming: Habit[] = action.payload
        const map = new Map<string, Habit>()
        for (const ex of state.items) map.set(ex.id, ex)
        for (const inc of incoming) {
          const ex = map.get(inc.id)
          const incDates = new Set(inc.datesCompleted ?? [])
          if (!ex) {
            const pendingTs = state.pending[inc.id]
            const incTime = inc.updatedAt ? Date.parse(inc.updatedAt) : 0
            if (pendingTs && pendingTs > incTime) continue
            map.set(inc.id, inc)
            continue
          }
          const pendingTs = state.pending[inc.id]
          const incTime = inc.updatedAt ? Date.parse(inc.updatedAt) : 0
          if (pendingTs && pendingTs > incTime) {
            map.set(ex.id, ex)
            continue
          }
          const mergedDatesSet = new Set([...(ex.datesCompleted ?? []), ...(inc.datesCompleted ?? [])])
          const mergedDates = Array.from(mergedDatesSet).sort()
          const mergedCompleted = mergedDates.length > 0
          const exTime = ex.updatedAt ? Date.parse(ex.updatedAt) : 0
          const finalUpdatedAt = (inc.updatedAt && Date.parse(inc.updatedAt) > exTime) ? inc.updatedAt : ex.updatedAt
          const merged: Habit = {
            ...ex,
            ...inc,
            datesCompleted: mergedDates,
            completed: mergedCompleted,
            updatedAt: finalUpdatedAt,
          }
          map.set(inc.id, merged)
        }
        state.items = Array.from(map.values())
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
        const updated = action.payload
        const idx = state.items.findIndex((h) => h.id === updated.id)
        if (idx >= 0) {
          const existing = state.items[idx]
          const exTime = existing.updatedAt ? Date.parse(existing.updatedAt) : 0
          const updTime = updated.updatedAt ? Date.parse(updated.updatedAt) : 0
          if (updTime >= exTime) {
            state.items[idx] = {
              ...existing,
              datesCompleted: updated.datesCompleted ?? existing.datesCompleted,
              completed: typeof updated.completed === 'boolean' ? updated.completed : (updated.datesCompleted ? updated.datesCompleted.length > 0 : existing.completed),
              updatedAt: updated.updatedAt ?? existing.updatedAt,
              streak: typeof updated.streak === 'number' ? updated.streak : existing.streak,
            }
          } else {
            state.items[idx] = { ...existing }
          }
        } else {
          state.items.push(updated)
        }
        if (updated.id && state.pending[updated.id]) delete state.pending[updated.id]
      })
      .addCase(checkInHabit.rejected, (state, action) => {
        const arg = (action.meta && (action.meta as any).arg) || null
        const id = arg ? (arg as any).id : null
        if (id && state.pending[id]) delete state.pending[id]
      })
  },
})

export function toggleLocalComplete(id: string) {
  return slice.actions.toggleLocalComplete(id)
}
export const { applyLocalCheckIn } = slice.actions
export default slice.reducer
