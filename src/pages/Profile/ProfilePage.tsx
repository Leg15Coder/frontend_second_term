import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchMe } from '../../features/user/userSlice'
import Card from '../../shared/ui/Card/Card'
import styles from './ProfilePage.module.css'

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { me, loading } = useAppSelector((s) => s.user)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.wrap}>
      <h1>Profile</h1>
      {me ? (
        <Card title={me.name}>
          <div>Email: {me.email}</div>
        </Card>
      ) : (
        <div>No user</div>
      )}
    </div>
  )
}

export default ProfilePage
