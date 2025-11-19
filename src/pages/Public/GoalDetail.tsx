import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MockLayout from './MockLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchGoals } from '../../features/goals/goalsSlice'

const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.goals)

  useEffect(() => {
    dispatch(fetchGoals())
  }, [dispatch])

  const goal = items.find((g) => g.id === id)

  if (!goal)
    return (
      <MockLayout>
        <main className="flex-1 p-8">
          <div className="glass-panel p-6">Goal not found</div>
        </main>
      </MockLayout>
    )

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{goal.title}</h2>
            <Link to="/public/goals" className="px-3 py-1 rounded bg-white/10">Back</Link>
          </div>
          <p className="mt-4 text-white/70">{goal.description}</p>
          <div className="mt-6">
            <h4 className="font-semibold">Progress</h4>
            <div className="w-full bg-black/20 rounded-full h-2.5 mt-2"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${goal.progress}%` }} /></div>
            <p className="text-sm text-white/60 mt-2">{goal.progress}% complete</p>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default GoalDetail

