import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const ErrorPages: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-white/70 mt-2">Page not found</p>
          <div className="mt-4"><Link to="/" className="px-4 py-2 rounded bg-white/10">Go home</Link></div>
        </div>
      </main>
    </MockLayout>
  )
}

export default ErrorPages

