import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const FinishChallenge: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#0A051A] group/design-root">
          <div className="flex flex-1 justify-center items-center p-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 items-center">
              <h1 className="text-white tracking-light text-3xl md:text-4xl font-bold leading-tight px-4 text-center pb-3 pt-6">Challenge Completed!</h1>
              <p className="text-gray-300 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-md">Well done! Your journey continues.</p>
              <div className="flex px-4 py-3 justify-center w-full max-w-xs mt-4">
                <Link to="/public/dashboard" className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#8A2BE2] text-white text-base font-bold leading-normal tracking-[0.015em]">To new adventures</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default FinishChallenge

