import React from 'react'
import { Link } from 'react-router-dom'
import MockLayout from './MockLayout'
import GoalCard from '../../shared/public/GoalCard'

const GoalsList: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="w-full max-w-4xl mx-auto rounded-xl glass-panel p-6 sm:p-8 lg:p-12">
          <div className="mb-6 text-left">
            <h1 className="text-3xl font-bold">My Goals</h1>
            <p className="mt-2 text-white/60">Track your progress and stay focused on what matters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GoalCard title="Learn Spanish Fluently" progress={45} description="Daily practice and immersion." />
            <GoalCard title="Run a Half Marathon" progress={75} description="Build endurance over months." />
            <GoalCard title="Read 50 Books" progress={10} description="10 down, 40 to go." />
            <GoalCard title="Ship a Side Project" progress={5} description="Make weekly progress." />
          </div>

        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/public/goals/new" className="btn-accent">Add New Goal</Link>
        </div>
      </main>
    </MockLayout>
  )
}

export default GoalsList
