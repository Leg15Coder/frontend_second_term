import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import Card from '../../shared/ui/Card/Card'
import { checkInHabit } from '../../features/habits/habitsSlice'

const HabitsSummary: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.habits)
  const today = new Date().toISOString().slice(0, 10)

  const handleCheckIn = (id: string) => {
    dispatch(checkInHabit({ id, date: today }))
  }

  if (items.length === 0) {
    return (
      <Card title="Habits for Today">
        <div>No habits yet. Create one to get started.</div>
      </Card>
    )
  }

  return (
    <Card title="Habits for Today">
      <ul>
        {items.slice(0, 5).map((h) => (
          <li key={h.id} className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">{h.title}</div>
              {h.description && <div className="text-sm text-muted-foreground">{h.description}</div>}
            </div>
            <div>
              <button className="btn btn-sm" onClick={() => handleCheckIn(h.id)}>
                Check-in
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default HabitsSummary

