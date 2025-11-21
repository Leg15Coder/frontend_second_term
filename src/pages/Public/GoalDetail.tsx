import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MockLayout from './MockLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchGoals } from '../../features/goals/goalsSlice'
import type { Goal } from '../../types'

const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.goals)

  useEffect(() => {
    dispatch(fetchGoals())
  }, [dispatch])

  const goal: Goal | undefined = items.find((g) => g.id === id)

  if (!goal) {
    return (
      <MockLayout>
        <main className="flex-1 p-8">
          <div className="glass-panel p-6">Goal not found</div>
        </main>
      </MockLayout>
    )
  }

  const progress = Math.max(0, Math.min(100, goal.progress ?? 0))

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{goal.title}</h2>
            <div className="flex gap-2">
              <button className="btn-accent">Edit</button>
              <Link to="/public/goals" className="px-3 py-1 rounded bg-white/10">Back</Link>
            </div>
          </div>
          <p className="mt-4 text-white/70">{goal.description ?? 'No description provided.'}</p>
          <div className="mt-6">
            <h4 className="font-semibold">Progress</h4>
            <div className="w-full bg-black/20 rounded-full h-3 mt-2"><div className="bg-primary h-3 rounded-full" style={{ width: `${progress}%` }} /></div>
            <p className="text-sm text-white/60 mt-2">{progress}% complete</p>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default GoalDetail
