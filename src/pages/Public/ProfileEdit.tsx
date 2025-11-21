import React, { useEffect, useState } from 'react'
import MockLayout from './MockLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchMe, updateMe } from '../../features/user/userSlice'
import { useNavigate } from 'react-router-dom'

const ProfileEdit: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { me } = useAppSelector((s) => s.user)
  const [name, setName] = useState(me?.name ?? '')
  const [email, setEmail] = useState(me?.email ?? '')

  useEffect(() => {
    if (!me) dispatch(fetchMe())
  }, [dispatch, me])

  useEffect(() => {
    setName(me?.name ?? '')
    setEmail(me?.email ?? '')
  }, [me])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(updateMe({ name, email }))
    navigate('/public/profile')
  }

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-3 rounded bg-white/5" aria-label="name" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-3 rounded bg-white/5" aria-label="email" type="email" />
            </label>
            <div className="flex gap-3">
              <button type="submit" className="btn-accent">Save</button>
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-white/10">Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </MockLayout>
  )
}

export default ProfileEdit
