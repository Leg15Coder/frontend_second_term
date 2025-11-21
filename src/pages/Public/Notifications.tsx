import React from 'react'
import MockLayout from './MockLayout'

const Notifications: React.FC = () => {
  const items = [
    { id: 'n1', message: 'You have a new follower', time: '1h' },
    { id: 'n2', message: 'Goal achieved: Read 10 books', time: '2d' },
  ]

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                <div>
                  <p className="text-sm">{it.message}</p>
                  <p className="text-xs text-white/60">{it.time}</p>
                </div>
                <button className="px-3 py-1 rounded bg-white/10">Mark read</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </MockLayout>
  )
}

export default Notifications

