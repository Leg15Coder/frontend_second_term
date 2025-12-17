import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import type { Todo, TodosState } from '../../types'

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (userId: string) => {
  const q = query(collection(db, 'todos'), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Todo))
})

export const addTodo = createAsyncThunk('todos/addTodo', async (payload: { title: string; description?: string; deadline?: string; userId: string }, { rejectWithValue }) => {
  try {
    const { auth } = await import('../../firebase')
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('User not authenticated')
    }
    if (currentUser.uid !== payload.userId) {
      throw new Error('User ID mismatch')
    }
    const now = Timestamp.now().toDate().toISOString()
    const todoData: Record<string, unknown> = {
      title: payload.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
      userId: currentUser.uid,
    }
    if (payload.description?.trim()) {
      todoData.description = payload.description.trim()
    }
    if (payload.deadline?.trim()) {
      todoData.deadline = payload.deadline.trim()
    }
    const docRef = await addDoc(collection(db, 'todos'), todoData)
    return {
      id: docRef.id,
      title: payload.title,
      description: payload.description || undefined,
      deadline: payload.deadline || undefined,
      completed: false,
      createdAt: now,
      updatedAt: now,
      userId: currentUser.uid,
    } as Todo
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return rejectWithValue(message || 'Failed to add todo')
  }
})

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async ({ id, completed }: { id: string; completed: boolean }) => {
  const docRef = doc(db, 'todos', id)
  await updateDoc(docRef, { completed: !completed, updatedAt: Timestamp.now().toDate().toISOString() })
  return { id, completed: !completed }
})

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: string) => {
  await deleteDoc(doc(db, 'todos', id))
  return id
})

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, data }: { id: string; data: Partial<Record<string, unknown>> }) => {
  const docRef = doc(db, 'todos', id)
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now().toDate().toISOString() })
  return { id, ...data }
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch todos'
      })
      .addCase(addTodo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add todo'
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to toggle todo'
      })
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<{ id: string; completed: boolean }>) => {
        const todo = state.items.find((t) => t.id === action.payload.id)
        if (todo) todo.completed = action.payload.completed
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<{ id: string } & Partial<Todo>>) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload }
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete todo'
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((t) => t.id !== action.payload)
      })
  },
})

export default todosSlice.reducer
