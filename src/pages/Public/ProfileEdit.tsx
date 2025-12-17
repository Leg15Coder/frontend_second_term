import React, { useEffect, useState } from 'react'
import MockLayout from './MockLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchMe, updateMe } from '../../features/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { storageService } from '../../services/storageService'

const ProfileEdit: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { me } = useAppSelector((s) => s.user)
  const [name, setName] = useState(me?.name ?? '')
  const [email, setEmail] = useState(me?.email ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(me?.photoURL ?? null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!me) dispatch(fetchMe())
  }, [dispatch, me])

  useEffect(() => {
    setName(me?.name ?? '')
    setEmail(me?.email ?? '')
    setPreview(me?.photoURL ?? null)
  }, [me])

  useEffect(() => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)
  }, [file])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let photoURL: string | undefined
    if (file) {
      setUploading(true)
      const path = `avatars/${me?.id ?? 'me'}/${Date.now()}_${file.name}`
      photoURL = await storageService.uploadAvatar(file, path, (p) => setProgress(Math.round(p)))
      setUploading(false)
    }
    await dispatch(updateMe({ name, photoURL }))
    navigate('/public/profile')
  }

  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Avatar</span>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5">
                  {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10" />}
                </div>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-3 rounded bg-white/5" aria-label="name" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-white/70">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-3 rounded bg-white/5" aria-label="email" type="email" />
            </label>
            {uploading && <div>Uploading: {progress}%</div>}
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
