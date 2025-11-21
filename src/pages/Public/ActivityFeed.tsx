import React from 'react'
import MockLayout from './MockLayout'

const ActivityFeed: React.FC = () => {
  const items = [
    { id: 'a1', text: 'Completed habit: Morning Meditation', time: 'Today, 08:12' },
    { id: 'a2', text: 'Added goal: Learn Spanish', time: 'Yesterday' },
    { id: 'a3', text: 'Completed challenge: 30-Day Meditation (day 12)', time: '2 days ago' },
  ]

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-6">
            <h1 className="text-2xl font-bold">Activity Feed</h1>
            <p className="text-white/60 mt-2">Recent actions from you and your network.</p>

            <ul className="mt-6 flex flex-col gap-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-start gap-4 p-3 bg-white/5 rounded-md">
                  <div className="text-accent material-symbols-outlined">history</div>
                  <div>
                    <p className="text-sm">{it.text}</p>
                    <p className="text-xs text-white/60 mt-1">{it.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default ActivityFeed

