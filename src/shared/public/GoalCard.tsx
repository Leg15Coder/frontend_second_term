import React from 'react'

interface Props {
  title: string
  progress?: number
  description?: string
}

const GoalCard: React.FC<Props> = ({ title, progress = 0, description }) => {
  const percent = Math.max(0, Math.min(100, Math.round(progress)))
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-3 glass-panel" role="group" aria-label={`Goal ${title}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="goal-card-title text-white">{title}</p>
      </div>

      <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden mt-1" aria-hidden>
        <div className="bg-primary h-3 rounded-full" style={{ width: `${percent}%`, boxShadow: '0 0 8px rgba(190, 52, 213, 0.7)' }} />
      </div>

      <p className="text-sm text-white-60 mt-1">{description ?? `${percent}% complete`}</p>

      <div className="mt-2 flex items-center justify-between text-sm text-white/60">
        <span aria-hidden>{percent}%</span>
        <button className="px-3 py-1 rounded bg-white/6 hover:bg-white/10 text-sm">Details</button>
      </div>
    </div>
  )
}

export default GoalCard
