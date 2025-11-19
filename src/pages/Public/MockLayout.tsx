import React from 'react'

interface Props {
  children: React.ReactNode
}

const MockLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[--bg]" style={{ minHeight: '100vh' }}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] animate-pulse" />
      </div>
      <div className="flex min-h-screen">
        {children}
      </div>
    </div>
  )
}

export default MockLayout

