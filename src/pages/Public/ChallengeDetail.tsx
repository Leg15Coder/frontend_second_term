import React from 'react'
import MockLayout from './MockLayout'
import { useParams, Link } from 'react-router-dom'

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const challenge = { id: id ?? 'c1', title: '30-Day Meditation', days: '12 / 30 Days', description: 'Complete your daily session to keep the streak alive.' }

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{challenge.title}</h2>
            <Link to="/public/challenges" className="px-3 py-1 rounded bg-white/10">Back</Link>
          </div>
          <p className="mt-4 text-white/70">{challenge.description}</p>
          <div className="mt-6">
            <h4 className="font-semibold">Progress</h4>
            <div className="mt-2 text-accent font-black">{challenge.days}</div>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default ChallengeDetail

