import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchGoals } from '../../features/goals/goalsSlice'
import Card from '../../shared/ui/Card/Card'
import styles from './GoalsPage.module.css'

const GoalsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.goals)

  useEffect(() => {
    dispatch(fetchGoals())
  }, [dispatch])

  return (
    <div className={styles.wrap}>
      <h1>Goals</h1>
      {loading && <div>Loading...</div>}
      <div className={styles.list}>
        {items.map((g) => (
          <Card key={g.id} title={g.title}>
            <div>{g.description}</div>
            <div>Progress: {g.progress ?? 0}%</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default GoalsPage
