import React from 'react'

interface Props {
  title: string
  subtitle?: string
  cta?: React.ReactNode
}

const PublicHero: React.FC<Props> = ({ title, subtitle, cta }) => {
  return (
    <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-white text-4xl font-black leading-tight">{title}</h1>
        {subtitle && <p className="text-white/60 mt-2">{subtitle}</p>}
      </div>
      {cta && <div className="ml-auto">{cta}</div>}
    </div>
  )
}

export default PublicHero

