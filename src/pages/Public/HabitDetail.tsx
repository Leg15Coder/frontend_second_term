import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MockLayout from './MockLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchHabits, toggleHabit } from '../../features/habits/habitsSlice'

const HabitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.habits)

  useEffect(() => {
    dispatch(fetchHabits())
  }, [dispatch])

  const habit = items.find((h) => h.id === id)

  if (!habit)
    return (
      <MockLayout>
        <main className="flex-1 p-8">
          <div className="glass-panel p-6">Habit not found</div>
        </main>
      </MockLayout>
    )

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{habit.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => dispatch(toggleHabit(habit.id))} className="px-3 py-1 rounded bg-white/10">Toggle</button>
              <Link to="/public/habits" className="px-3 py-1 rounded bg-white/10">Back</Link>
            </div>
          </div>
          <p className="mt-4 text-white/70">{habit.description}</p>
          <div className="mt-6">
            <h4 className="font-semibold">Streak</h4>
            <div>{habit.streak} days</div>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default HabitDetail

