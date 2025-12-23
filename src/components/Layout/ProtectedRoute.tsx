import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/store'

const FullscreenSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
)

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { loading, isAuthenticated, error } = useAppSelector((s) => s.user)

  if (error && !loading) return <Navigate to="/login" state={{ from: location }} replace />

  if (loading) return <FullscreenSpinner />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  if (children) return <>{children}</>
  return <Outlet />
}

export default ProtectedRoute
