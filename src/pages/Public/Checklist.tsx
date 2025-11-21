import React from 'react'
import MockLayout from './MockLayout'

const Checklist: React.FC = () => {
  const items = [
    { id: 'c1', text: 'Set up your morning routine', done: true },
    { id: 'c2', text: 'Meditate for 10 minutes', done: false },
    { id: 'c3', text: 'Plan your day', done: false },
    { id: 'c4', text: 'Read 20 pages', done: true },
  ]

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-6">
            <h1 className="text-2xl font-bold">Daily Checklist</h1>
            <p className="text-white/60 mt-2">Quick tasks to keep your day on track.</p>

            <ul className="mt-6 flex flex-col gap-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked={it.done} className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary" />
                    <span className={`${it.done ? 'line-through text-white/60' : ''}`}>{it.text}</span>
                  </label>
                  <div className="text-sm text-white/60">{it.done ? 'Done' : 'Pending'}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end">
              <button className="btn-accent">Add Item</button>
            </div>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default Checklist

