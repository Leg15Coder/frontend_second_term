import React, { useEffect } from 'react'
import MockLayout from './MockLayout'

const FinishChallengeAnimated: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // placeholder for animation end handling
      console.log('Animation done')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="relative flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-starlight">Quest Complete</h1>
            <p className="mt-4 text-lg text-starlight/80">A new chapter is written. Your path unfolds.</p>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default FinishChallengeAnimated

