import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'
import ChallengeCard from '../../shared/public/ChallengeCard'

const SAMPLE_CHALLENGES = [
  { id: 'c1', title: '30-Day Meditation', days: 12 },
  { id: 'c2', title: '21-Day Fitness', days: 5 },
  { id: 'c3', title: 'Reading Sprint', days: 18 },
  { id: 'c4', title: 'Hydration Habit', days: 9 },
  { id: 'c5', title: 'Sleep Better', days: 3 },
  { id: 'c6', title: 'Daily Coding', days: 14 },
]

const ChallengesList: React.FC = () => {
  return (
    <MockLayout>
      <aside className="w-64 p-4 flex-shrink-0">
        <div className="flex h-full flex-col justify-between glass-panel p-4">
          <div>
            <div className="flex gap-3 items-center">
              <div className="avatar-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80')" }} />
              <div>
                <h1 className="text-white font-medium">Alex Mercer</h1>
                <p className="text-white/60 text-sm">Challenges</p>
              </div>
            </div>
            <nav className="mt-6 flex flex-col gap-2">
              <Link to="/public/challenges" className="px-3 py-2 rounded-lg hover:bg-white/5">All Challenges</Link>
              <Link to="/public/challenges?filter=mine" className="px-3 py-2 rounded-lg hover:bg-white/5">My Challenges</Link>
            </nav>
          </div>
          <div>
            <Link to="/public/challenges/new" className="px-3 py-2 rounded-lg hover:bg-white/5">Create Challenge</Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} title={c.title} days={`${c.days} / 30 Days`} description="Short description about the challenge and rules." />
          ))}
        </div>
      </main>
    </MockLayout>
  )
}

export default ChallengesList
