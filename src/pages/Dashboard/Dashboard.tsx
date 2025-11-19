import React from 'react'
import styles from './Dashboard.module.css'

const Dashboard: React.FC = () => {
  return (
    <div className={styles.wrap} style={{ height: '100%' }}>
      <iframe
        title="Dashboard Mock"
        src="/Dashboard.html"
        style={{ width: '100%', height: '100vh', border: '0' }}
      />
    </div>
  )
}

export default Dashboard
