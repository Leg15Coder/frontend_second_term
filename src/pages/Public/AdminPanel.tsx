import React from 'react'
import MockLayout from './MockLayout'

const AdminPanel: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded">Users</div>
            <div className="p-4 bg-white/5 rounded">System Logs</div>
            <div className="p-4 bg-white/5 rounded">Feature Flags</div>
            <div className="p-4 bg-white/5 rounded">Backups</div>
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default AdminPanel

