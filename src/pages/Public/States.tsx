import React from 'react'
import MockLayout from './MockLayout'

const States: React.FC = () => {
  const states = [
    { id: 's1', label: 'Completed', color: 'green' },
    { id: 's2', label: 'In progress', color: 'yellow' },
    { id: 's3', label: 'Missed', color: 'red' },
  ]

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto glass-panel p-6">
          <h1 className="text-2xl font-bold">States</h1>
          <div className="mt-4 flex gap-3">
            {states.map((st) => (
              <div key={st.id} className="p-3 rounded-md bg-white/5 text-white/80">{st.label}</div>
            ))}
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default States

