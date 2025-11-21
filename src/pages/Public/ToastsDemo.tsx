import React from 'react'
import MockLayout from './MockLayout'

const ToastsDemo: React.FC = () => {
  const samples = [
    { id: 't1', kind: 'success', text: 'Goal saved' },
    { id: 't2', kind: 'error', text: 'Failed to save' },
  ]

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <h1 className="text-2xl font-bold">Toasts</h1>
          <div className="mt-4 flex flex-col gap-3">
            {samples.map(s => (
              <div key={s.id} className="p-3 rounded bg-white/5 flex items-center justify-between">
                <div>{s.text}</div>
                <div className="text-sm text-white/60">{s.kind}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default ToastsDemo

