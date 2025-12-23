import React from 'react'
import { useAppSelector } from '../../app/store'
import Card from '../../shared/ui/Card/Card'

const GoalsProgress: React.FC = () => {
  const { items } = useAppSelector((s) => s.goals)

  if (items.length === 0) {
    return (
      <Card title="Goals Progress">
        <div>No active goals. Create one to track progress.</div>
      </Card>
    )
  }

  return (
    <Card title="Goals Progress">
      <ul>
        {items.map((g) => (
          <li key={g.id} className="py-2">
            <div className="flex justify-between">
              <div className="font-medium">{g.title}</div>
              <div className="text-sm">{g.progress ?? 0}%</div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-primary h-2 rounded" style={{ width: `${g.progress ?? 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default GoalsProgress

