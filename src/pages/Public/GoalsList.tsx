import React from 'react'
import { Link } from 'react-router-dom'
import MockLayout from './MockLayout'

const GoalsList: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="w-full max-w-4xl mx-auto rounded-xl bg-parchment dark:bg-parchment-dark p-6 sm:p-8 lg:p-12 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black tracking-[-0.033em] text-text-dark dark:text-parchment">My Book of Goals</h1>
            <p className="mt-2 text-base text-text-dark/70">Your next chapter awaits. What great quest will you embark on?</p>
          </div>

          <div className="flex flex-col gap-4">
            <details className="group flex flex-col rounded-xl border border-primary/50 bg-white/50 px-4 py-2" open>
              <summary className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center gap-4"><span className="material-symbols-outlined text-primary">auto_awesome</span><p>Master a New Skill</p></div>
                <span className="material-symbols-outlined">expand_more</span>
              </summary>
              <div className="pt-2 pb-4">
                <div className="flex justify-between"><p className="text-sm">Progress</p><p className="text-sm">100%</p></div>
                <div className="h-2 rounded-full bg-primary/20"><div className="h-2 rounded-full bg-primary" style={{ width: '100%' }}></div></div>
              </div>
            </details>
            <details className="group flex flex-col rounded-xl border px-4 py-2" open>
              <summary className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center gap-4"><span className="material-symbols-outlined">directions_run</span><p>Achieve Physical Fitness</p></div>
                <span className="material-symbols-outlined">expand_more</span>
              </summary>
              <div className="pt-2 pb-4">
                <div className="flex justify-between"><p className="text-sm">Progress</p><p className="text-sm">33%</p></div>
                <div className="h-2 rounded-full bg-primary/20"><div className="h-2 rounded-full bg-primary" style={{ width: '33%' }}></div></div>
              </div>
            </details>
          </div>

        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/public/goals/new" className="flex h-12 items-center justify-center gap-x-3 rounded-full border border-primary bg-primary px-8 text-base font-semibold text-text-dark shadow-lg">Add New Goal</Link>
        </div>
      </main>
    </MockLayout>
  )
}

export default GoalsList
