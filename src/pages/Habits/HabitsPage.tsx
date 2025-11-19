import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchHabits, toggleHabit } from '../../features/habits/habitsSlice'
import Card from '../../shared/ui/Card/Card'
import Button from '../../shared/ui/Button/Button'
import styles from './HabitsPage.module.css'

const HabitsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.habits)

  useEffect(() => {
    dispatch(fetchHabits())
  }, [dispatch])

  return (
    <div className={styles.wrap}>
      <h1>Habits</h1>
      {loading && <div>Loading...</div>}
      <div className={styles.list}>
        {items.map((h) => (
          <Card key={h.id} title={h.title}>
            <div>{h.description}</div>
            <div>Completed: {h.completed ? 'Yes' : 'No'}</div>
            <Button onClick={() => dispatch(toggleHabit(h.id))} variant="secondary">Toggle</Button>
          </Card>
        ))}
      </div>
      <iframe title="Habits Mock" src="/Habbits.html" style={{ width: '100%', height: '100vh', border: '0' }} />
    </div>
  )
}

export default HabitsPage
