import React from 'react'
import Loader from '../../shared/ui/Loader/Loader'
import ErrorBanner from '../../shared/ui/ErrorBanner/ErrorBanner'

type Props = {
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  size?: number
}

const Status: React.FC<Props> = ({ loading, error, onRetry, size = 40 }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Loader size={size} />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner message={error} onRetry={onRetry} />
  }

  return null
}

export default Status

