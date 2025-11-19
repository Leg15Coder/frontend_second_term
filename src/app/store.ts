import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { useSelector, type TypedUseSelectorHook } from 'react-redux'
import habitsReducer from '../features/habits/habitsSlice'
import goalsReducer from '../features/goals/goalsSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    goals: goalsReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
