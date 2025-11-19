import React from 'react'

interface Props {
  value: string | number
  label: string
  className?: string
}

const StatCard: React.FC<Props> = ({ value, label, className = '' }) => {
  return (
    <div className={`${className} p-4 bg-white/5 rounded-lg text-center`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </div>
  )
}

export default StatCard

