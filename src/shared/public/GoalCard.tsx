import React from 'react'

interface Props {
  title: string
  progress?: number
  description?: string
}

const GoalCard: React.FC<Props> = ({ title, progress = 0, description }) => {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-3">
      <p className="text-white font-semibold">{title}</p>
      <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(190, 52, 213, 0.7)' }} />
      </div>
      {description && <p className="text-sm text-white/60">{description}</p>}
    </div>
  )
}

export default GoalCard

