import React from 'react'
import styles from './ErrorBanner.module.css'

interface Props {
  message?: string
  onRetry?: () => void
}

const ErrorBanner: React.FC<Props> = ({ message = 'An error occurred', onRetry }) => {
  return (
    <div className={styles.banner} role="alert">
      <div className={styles.message}>{message}</div>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry} aria-label="Retry">
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorBanner

