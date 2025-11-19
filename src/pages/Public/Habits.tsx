import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const SAMPLE_HABITS = [
  { id: 'h1', title: 'Morning Meditation', streak: 21 },
  { id: 'h2', title: 'Read Ancient Texts', streak: 5 },
  { id: 'h3', title: 'Strength Ritual', streak: 12 },
  { id: 'h4', title: 'Nature Walk', streak: 8 },
  { id: 'h5', title: 'Journaling', streak: 33 },
  { id: 'h6', title: 'Evening Stretch', streak: 4 },
  { id: 'h7', title: 'Hydration', streak: 10 },
  { id: 'h8', title: 'Reading', streak: 2 },
]

const Habits: React.FC = () => {
  return (
    <MockLayout>
      <aside className="w-64 p-4 flex-shrink-0">
        <div className="flex h-full flex-col justify-between glass-panel p-4">
          <div>
            <div className="flex gap-3 items-center">
              <div className="rounded-full w-12 h-12 bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80')" }} />
              <div>
                <h1 className="text-white font-medium">Alex Mercer</h1>
                <p className="text-white/60 text-sm">Book of Habits</p>
              </div>
            </div>
            <nav className="mt-6 flex flex-col gap-2">
              <Link to="/public/habits" className="px-3 py-2 rounded-lg hover:bg-white/5">All</Link>
              <Link to="/public/habits?filter=active" className="px-3 py-2 rounded-lg hover:bg-white/5">Active</Link>
              <Link to="/public/habits?filter=completed" className="px-3 py-2 rounded-lg hover:bg-white/5">Completed</Link>
            </nav>
          </div>
          <div>
            <Link to="/public/habits/new" className="px-3 py-2 rounded-lg hover:bg-white/5">View All Glyphs</Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-widest">Book of Habits</h1>
            <p className="text-white/60 mt-2">Forge your destiny, one ritual at a time.</p>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {SAMPLE_HABITS.map((h) => (
                <div key={h.id} className="magic-card p-6 text-center">
                  <span className="material-symbols-outlined text-6xl text-rune-glow mb-4">self_improvement</span>
                  <h2 className="rune-text text-xl font-bold">{h.title}</h2>
                  <p className="text-stone-400 text-sm mt-2">Short description of habit.</p>
                  <div className="mt-4 text-stone-300 text-xs font-mono">Streak: {h.streak} Days</div>
                </div>
              ))}
              <Link to="/public/habits/new" className="magic-card border-dashed border-amber-500/30 group flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-stone-600 mb-4">add_circle</span>
                  <h2 className="rune-text text-xl font-bold">New Ritual</h2>
                </div>
              </Link>
            </div>
          </main>
        </div>
      </main>
    </MockLayout>
  )
}

export default Habits
