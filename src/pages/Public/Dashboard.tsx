import React from 'react'
import MockLayout from './MockLayout'
import PublicHero from '../../shared/public/PublicHero'
import GoalCard from '../../shared/public/GoalCard'
import ChallengeCard from '../../shared/public/ChallengeCard'
import { Link } from 'react-router-dom'

const Dashboard: React.FC = () => {
  return (
    <MockLayout>
      <aside className="w-64 p-4 flex-shrink-0">
        <div className="flex h-full flex-col justify-between glass-panel p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-accent/50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80')", width: 48, height: 48 }} />
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium">Alex Mercer</h1>
                <p className="text-white/60 text-sm">Welcome Back</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 border border-white/20" to="/public/dashboard">
                <span className="material-symbols-outlined text-accent">dashboard</span>
                <p className="text-white text-sm">Dashboard</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5" to="/public/habits">
                <span className="material-symbols-outlined text-white/80">checklist</span>
                <p className="text-white/80 text-sm">Habits</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5" to="/public/goals">
                <span className="material-symbols-outlined text-white/80">flag</span>
                <p className="text-white/80 text-sm">Goals</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5" to="/public/challenges">
                <span className="material-symbols-outlined text-white/80">shield</span>
                <p className="text-white/80 text-sm">Challenges</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5" to="/public/settings">
              <span className="material-symbols-outlined text-white/80">settings</span>
              <p className="text-white/80 text-sm">Settings</p>
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <PublicHero title="Dashboard" subtitle="Here's your progress for today. Keep going!" cta={<button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-accent/10 text-accent text-sm font-bold border border-accent/80">Add New Goal</button>} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="glass-panel p-6">
                <h2 className="text-white text-[22px] font-bold pb-4">Today's Focus</h2>
                <div className="flex flex-col divide-y divide-white/10">
                  <label className="flex gap-x-4 py-4 items-center cursor-pointer group">
                    <input className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary" type="checkbox" />
                    <p className="text-white/80 text-base">Meditate for 10 minutes</p>
                  </label>
                  <label className="flex gap-x-4 py-4 items-center cursor-pointer group">
                    <input defaultChecked className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary" type="checkbox" />
                    <p className="text-white/80 text-base line-through text-white/50">Read 1 chapter of a book</p>
                  </label>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-white text-[22px] font-bold pb-4">Active Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GoalCard title="Learn Spanish Fluently" progress={45} description="" />
                  <GoalCard title="Run a Half Marathon" progress={75} description="" />
                </div>
              </div>

            </div>
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="glass-panel p-6">
                <h2 className="text-white text-[22px] font-bold pb-4">Ongoing Challenge</h2>
                <ChallengeCard title="30-Day Meditation" days="12 / 30 Days" description="Complete your daily session to keep the streak alive." />
              </div>
              <div className="glass-panel p-6">
                <h2 className="text-white text-[22px] font-bold pb-4">Progress Overview</h2>
                <div className="flex items-center justify-center">
                  <div className="relative size-40">
                    <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                      <circle className="stroke-current text-white/10" cx="18" cy="18" fill="none" r="16" strokeWidth={3} />
                      <circle className="stroke-current text-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray={100} strokeDashoffset={35} strokeLinecap="round" strokeWidth={3} transform="rotate(-90 18 18)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">65%</span>
                      <span className="text-sm text-white/60">Weekly Habits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </MockLayout>
  )
}

export default Dashboard
