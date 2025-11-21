import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import habitsReducer from '../features/habits/habitsSlice'
import userReducer from '../features/user/userSlice'
import goalsReducer from '../features/goals/goalsSlice'

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    user: userReducer,
    goals: goalsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
