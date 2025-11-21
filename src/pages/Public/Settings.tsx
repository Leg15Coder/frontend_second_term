import React, { useState } from 'react'
import MockLayout from './MockLayout'

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between">
              <span className="text-white/80">Notifications</span>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications((s) => !s)} className="h-5 w-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white/80">Dark mode</span>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((s) => !s)} className="h-5 w-5" />
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn-accent">Save settings</button>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default Settings
