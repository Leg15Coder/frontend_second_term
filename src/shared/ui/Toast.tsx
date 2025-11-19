import React from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  let bg = 'bg-blue-600'
  if (type === 'success') bg = 'bg-green-600'
  if (type === 'error') bg = 'bg-red-600'
  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-md text-white ${bg} shadow-lg`}>{message}</div>
  )
}

export default Toast
