import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MockLayout from './MockLayout'
import { useAppDispatch } from '../../app/store'
import { addGoal } from '../../features/goals/goalsSlice'
import type { Goal } from '../../types'

const GoalCreateEdit: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [detailedDescription, setDetailedDescription] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      detailedDescription,
      progress: 0,
      completed: false,
    }
    await dispatch(addGoal(payload))
    navigate('/public/goals')
  }

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Create Goal</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-3 rounded bg-white/5" aria-label="goal title" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Details</span>
              <textarea value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} className="mt-1 p-3 rounded bg-white/5" rows={4} aria-label="goal details" />
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

export default GoalCreateEdit
