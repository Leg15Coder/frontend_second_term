import React, { useEffect } from 'react'
import MockLayout from './MockLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchMe } from '../../features/user/userSlice'
import { Link } from 'react-router-dom'

const ProfileView: React.FC = () => {
  const dispatch = useAppDispatch()
  const { me, loading } = useAppSelector((s) => s.user)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-center bg-cover" style={{ backgroundImage: `url(${me?.avatarUrl ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'})` }} />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{me?.name ?? 'Guest'}</h2>
              <p className="text-white/70">{me?.email}</p>
              <div className="mt-4 flex gap-3">
                <Link to="/public/profile/edit" className="px-4 py-2 rounded bg-accent/10 text-accent border border-accent/80">Edit Profile</Link>
                <Link to="/public/settings" className="px-4 py-2 rounded bg-white/10">Settings</Link>
              </div>
            </div>
          </div>

          <div className="mt-6 glass-panel p-6">
            <h3 className="text-lg font-bold">Statistics</h3>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-white/60">Habits</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-white/60">Goals</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-white/60">Challenges</div>
              </div>
            </div>
          </div>

          <div className="mt-6 glass-panel p-6">
            <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
            {loading && <div className="text-white/60">Loading...</div>}
            {!loading && (
              <ul className="flex flex-col gap-3">
                <li className="flex justify-between items-center p-3 bg-white/5 rounded-md">
                  <div>
                    <p className="text-sm">Completed habit: Morning Meditation</p>
                    <p className="text-xs text-white/60">Today, 08:12</p>
                  </div>
                  <span className="text-accent">✓</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default ProfileView

