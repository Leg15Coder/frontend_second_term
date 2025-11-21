import React from 'react'

interface Props {
  title: string
  days?: string
  description?: string
}

const ChallengeCard: React.FC<Props> = ({ title, days, description }) => {
  return (
    <div className="relative p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/30 flex flex-col gap-3 items-center text-center glow-border challenge-card">
      <span className="material-symbols-outlined text-accent text-4xl">local_fire_department</span>
      <p className="text-white font-bold text-lg">{title}</p>
      {description && <p className="text-white/70 text-sm">{description}</p>}
      {days && <div className="mt-2 text-2xl font-black text-accent tracking-widest">{days}</div>}
    </div>
  )
}

export default ChallengeCard
