import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const steps = [
  { id: 's1', title: 'Welcome', desc: 'Welcome to the app. We will set up your first habits.' },
  { id: 's2', title: 'Create Habit', desc: 'Add a habit you want to track.' },
  { id: 's3', title: 'Set Goals', desc: 'Define a goal to work towards.' },
]

const Onboarding: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome aboard</h1>
          <p className="text-white/70 mb-6">A short setup to get you started</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {steps.map((s) => (
              <div key={s.id} className="glass-panel p-4">
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-white/70 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/public/habits/new" className="btn-accent" aria-label="get-started">Get started</Link>
        </div>
      </main>
    </MockLayout>
  )
}

export default Onboarding
