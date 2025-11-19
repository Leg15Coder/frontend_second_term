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
              <span>Notifications</span>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications((s) => !s)} />
            </label>
            <label className="flex items-center justify-between">
              <span>Dark mode</span>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((s) => !s)} />
            </label>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default Settings

