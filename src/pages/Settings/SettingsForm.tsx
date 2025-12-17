import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { updateMe, logoutUser } from '../../features/user/userSlice'
import { settingsService, type UserSettings } from '../../services/settingsService'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const SettingsForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.user.me)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      settingsService.getSettings(user.id).then((s) => {
        setSettings(s)
        setDisplayName(s.displayName || user.name || '')
        setPhotoURL(s.photoURL || user.photoURL || '')
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user?.id) return
    if (!displayName.trim() || displayName.length < 2) {
      toast.error('Имя должно содержать минимум 2 символа')
      return
    }

    setLoading(true)
    try {
      await dispatch(updateMe({ name: displayName, photoURL })).unwrap()
      await settingsService.updateSettings(user.id, { displayName, photoURL })
      toast.success('Профиль обновлён!')
    } catch {
      toast.error('Ошибка при обновлении профиля')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleNotifications = async () => {
    if (!user?.id || !settings) return
    const updated = !settings.notifications
    try {
      const newSettings = await settingsService.updateSettings(user.id, { notifications: updated })
      setSettings(newSettings)
      toast.success(`Уведомления ${updated ? 'включены' : 'отключены'}`)
    } catch {
      toast.error('Ошибка при обновлении настроек')
    }
  }

  const handleChangeTheme = async (theme: 'light' | 'dark') => {
    if (!user?.id) return
    try {
      const newSettings = await settingsService.updateSettings(user.id, { theme })
      setSettings(newSettings)
      toast.success(`Тема изменена на ${theme === 'dark' ? 'тёмную' : 'светлую'}`)
    } catch {
      toast.error('Ошибка при изменении темы')
    }
  }

  const handleChangeVisibility = async (visibility: 'public' | 'private') => {
    if (!user?.id) return
    try {
      const newSettings = await settingsService.updateSettings(user.id, { profileVisibility: visibility })
      setSettings(newSettings)
      toast.success(`Профиль ${visibility === 'public' ? 'публичный' : 'приватный'}`)
    } catch {
      toast.error('Ошибка при изменении видимости')
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.id) return
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить аккаунт? Все локальные данные будут безвозвратно удалены.'
    )
    if (!confirmed) return

    try {
      await settingsService.deleteAccount(user.id)
      await dispatch(logoutUser()).unwrap()
      toast.success('Аккаунт удалён')
      navigate('/login')
    } catch {
      toast.error('Ошибка при удалении аккаунта')
    }
  }

  if (!settings) {
    return <div className="text-white/60">Загрузка настроек...</div>
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <h2 className="text-white text-xl font-bold mb-4">Профиль</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="text-white/80 text-sm mb-2 block">
              Имя
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label htmlFor="photoURL" className="text-white/80 text-sm mb-2 block">
              URL аватара
            </label>
            <Input
              id="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {loading ? 'Сохранение...' : 'Сохранить профиль'}
          </Button>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-white text-xl font-bold mb-4">Уведомления</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80">Получать уведомления</p>
            <p className="text-white/60 text-sm">Включить или отключить уведомления</p>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications ? 'bg-primary' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-white text-xl font-bold mb-4">Тема</h2>
        <Select onValueChange={handleChangeTheme} defaultValue={settings.theme}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Выберите тему" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f2e] border-white/10">
            <SelectItem value="dark" className="text-white hover:bg-white/10">
              Тёмная
            </SelectItem>
            <SelectItem value="light" className="text-white hover:bg-white/10">
              Светлая
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-white text-xl font-bold mb-4">Приватность</h2>
        <div>
          <label htmlFor="visibility" className="text-white/80 text-sm mb-2 block">
            Видимость профиля
          </label>
          <Select
            onValueChange={handleChangeVisibility}
            defaultValue={settings.profileVisibility}
          >
            <SelectTrigger id="visibility" className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Выберите видимость" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1f2e] border-white/10">
              <SelectItem value="public" className="text-white hover:bg-white/10">
                Публичный
              </SelectItem>
              <SelectItem value="private" className="text-white hover:bg-white/10">
                Приватный
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass-panel p-6 border-red-500/20">
        <h2 className="text-red-400 text-xl font-bold mb-4">Опасная зона</h2>
        <p className="text-white/60 text-sm mb-4">
          Удаление аккаунта приведёт к полной потере всех локальных данных (привычки, цели, настройки).
        </p>
        <Button
          onClick={handleDeleteAccount}
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
        >
          Удалить аккаунт
        </Button>
      </div>
    </div>
  )
}

export default SettingsForm

