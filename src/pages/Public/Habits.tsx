import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchHabits, createHabit, toggleLocalComplete } from '../../features/habits/habitsSlice'
import type { Habit } from '../../types'

const HabitsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.habits)

  useEffect(() => {
    dispatch(fetchHabits())
  }, [dispatch])

  const onAdd = () => {
    const title = globalThis.prompt('New habit title')
    if (title) {
      const payload: Omit<Habit, 'id' | 'createdAt' | 'streak'> = {
        title,
        completed: false,
      }
      dispatch(createHabit(payload))
    }
  }

  return (
    <div className="p-8">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Habits</h2>
          <div>
            <button type="button" onClick={onAdd} className="btn-accent">Add Habit</button>
          </div>
        </div>

        <div className="mt-4">
          {loading && <p className="text-white/60">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          <ul className="flex flex-col gap-3 mt-3">
            {items.map((h) => (
              <li key={h.id} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={h.completed}
                    onChange={() => dispatch(toggleLocalComplete(h.id))}
                    className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary"
                  />
                  <span className={`${h.completed ? 'line-through text-white/60' : ''}`}>{h.title}</span>
                </div>
                <div className="text-sm text-white/60">{h.streak ?? 0}d</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HabitsPage
