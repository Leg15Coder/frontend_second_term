import React from 'react'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-[#1B1038] rounded-full blur-[120px]"></div>
      </div>

      <div className="flex h-full min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout

