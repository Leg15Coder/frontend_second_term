import React, { useEffect } from 'react'
import styles from './Dashboard.module.css'
import { useAppDispatch, useAppSelector, type RootState } from '../../app/store'
import { fetchHabits } from '../../features/habits/habitsSlice'
import { fetchGoals } from '../../features/goals/goalsSlice'
import Card from '../../shared/ui/Card/Card'

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: habits, loading: habitsLoading } = useAppSelector((s: RootState) => s.habits)
  const { items: goals, loading: goalsLoading } = useAppSelector((s: RootState) => s.goals)

  useEffect(() => {
    dispatch(fetchHabits())
    dispatch(fetchGoals())
  }, [dispatch])

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <Card title="Habits">
          {habitsLoading ? (
            <div>Loading...</div>
          ) : (
            <div>{habits.length} habits</div>
          )}
        </Card>
        <Card title="Goals">
          {goalsLoading ? (
            <div>Loading...</div>
          ) : (
            <div>{goals.length} goals</div>
          )}
        </Card>
      </div>

      <div style={{ marginTop: 12 }}>
        <iframe
          title="Dashboard Mock"
          src="/Dashboard.html"
          style={{ width: '100%', height: '60vh', border: '0' }}
        />
      </div>
    </div>
  )
}

export default Dashboard
