import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const Pathway: React.FC = () => {
  return (
    <MockLayout>
      <aside className="w-64 p-4 flex-shrink-0">
        <div className="flex h-full flex-col justify-between glass-panel p-4">
          <div>
            <div className="flex gap-3 items-center">
              <div className="avatar-lg" style={{ width: 48, height: 48, backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80')" }} />
              <div>
                <h1 className="text-white font-medium">Alex Mercer</h1>
                <p className="text-white/60 text-sm">Level 12 Mage</p>
              </div>
            </div>
            <nav className="mt-6 flex flex-col gap-2">
              <Link to="/public/dashboard" className="px-3 py-2 rounded-lg hover:bg-white/5">Dashboard</Link>
              <Link to="/public/habits" className="px-3 py-2 rounded-lg hover:bg-white/5">Habits</Link>
              <Link to="/public/goals" className="px-3 py-2 rounded-lg hover:bg-white/5">Goals</Link>
            </nav>
          </div>
          <div>
            <Link to="/public/settings" className="px-3 py-2 rounded-lg hover:bg-white/5">Settings</Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex flex-col gap-4 mb-6">
          <p className="text-white text-4xl font-black">The Mystic Path</p>
          <p className="text-white/60">Your current challenge. Embark on a journey of self-improvement.</p>
        </div>

        <div className="flex-1 glass-panel rounded-xl flex items-center justify-center overflow-hidden relative p-8">
          <div className="relative w-full h-full p-12">
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80')", transform: 'scale(1.1)' }} />
            <div className="relative w-full h-full p-12">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke-current text-white/20" d="M 100 400 Q 250 300, 400 350 T 700 100" fill="none" strokeDasharray="5 5" strokeWidth="2"></path>
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
                <div className="glass-panel p-6 border-accent/50 flex flex-col gap-4 text-center items-center">
                  <span className="material-symbols-outlined text-accent text-5xl">auto_stories</span>
                  <h3 className="text-white text-2xl font-bold">Chapter 2: The Silent Library</h3>
                  <p className="text-white/80 text-base">Your task is to read for 30 minutes. Focus your mind, gather knowledge, and prepare for the path ahead.</p>
                  <button className="btn-accent mt-2">Mark as Complete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default Pathway
