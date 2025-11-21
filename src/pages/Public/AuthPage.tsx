import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const AuthPage: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-md mx-auto glass-panel p-6 text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-white/60 mb-4">Use your account to sign in.</p>
          <div className="flex flex-col gap-3">
            <button className="btn-accent">Sign in with Email</button>
            <Link to="/" className="text-white/60">Continue as guest</Link>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default AuthPage

