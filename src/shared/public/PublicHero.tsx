import React from 'react'

interface Props {
  title: string
  subtitle?: string
  cta?: React.ReactNode
}

const PublicHero: React.FC<Props> = ({ title, subtitle, cta }) => {
  return (
    <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
      <div className="public-hero-left">
        <h1 className="public-hero-title text-white">{title}</h1>
        {subtitle && <p className="text-white-60 mt-2">{subtitle}</p>}
      </div>
      {cta && (
        <div className="ml-auto">
          {React.isValidElement(cta) ? (
            cta
          ) : (
            <div className="btn-ghost-accent">{cta}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default PublicHero
