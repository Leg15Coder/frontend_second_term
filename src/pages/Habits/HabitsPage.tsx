import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchHabits, toggleLocalComplete } from '../../features/habits/habitsSlice'
import Card from '../../shared/ui/Card/Card'
import Button from '../../shared/ui/Button/Button'
import Loader from '../../shared/ui/Loader/Loader'
import ErrorBanner from '../../shared/ui/ErrorBanner/ErrorBanner'
import styles from './HabitsPage.module.css'

const HabitsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.habits)

  useEffect(() => {
    dispatch(fetchHabits())
  }, [dispatch])

  return (
    <div className={styles.wrap}>
      <h1>Habits</h1>
      {loading && <Loader size={32} />}
      {error && <ErrorBanner message={error} onRetry={() => dispatch(fetchHabits())} />}
      <div className={styles.list}>
        {items.map((h) => (
          <Card key={h.id} title={h.title}>
            <div>{h.description}</div>
            <div>Completed: {h.completed ? 'Yes' : 'No'}</div>
            <Button onClick={() => dispatch(toggleLocalComplete(h.id))} variant="secondary">Toggle</Button>
          </Card>
        ))}
      </div>
      <iframe title="Habits Mock" src="/Habbits.html" style={{ width: '100%', height: '100vh', border: '0' }} />
    </div>
  )
}

export default HabitsPage
