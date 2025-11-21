import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MockLayout from './MockLayout'
import { useAppDispatch } from '../../app/store'
import { createHabit } from '../../features/habits/habitsSlice'
import type { Habit } from '../../types'

const HabitCreateEdit: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'streak'> = {
      title,
      description,
      completed: false,
    }
    await dispatch(createHabit(payload))
    navigate('/public/habits')
  }

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Create Habit</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-3 rounded bg-white/5" aria-label="habit title" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 p-3 rounded bg-white/5" rows={4} aria-label="habit description" />
            </label>
            <div className="flex gap-3">
              <button type="submit" className="btn-accent">Create</button>
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-white/10">Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </MockLayout>
  )
}

export default HabitCreateEdit
