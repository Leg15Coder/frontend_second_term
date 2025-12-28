import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { updateMe, logoutUser } from '../../features/user/userSlice'
import { settingsService, type UserSettings } from '../../services/settingsService'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { showErrorToast, showSuccessToast } from '../../lib/toast'

const SettingsForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.user.me)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReauthDialog, setShowReauthDialog] = useState(false)
  const [reauthPassword, setReauthPassword] = useState('')

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
      'Вы уверены, что хотите удалить аккаунт? Все данные будут безвозвратно удалены из Firebase.'
    )
    if (!confirmed) return

    setLoading(true)
    try {
      await settingsService.deleteAccount(user.id)
      await dispatch(logoutUser()).unwrap()
      showSuccessToast('Аккаунт успешно удалён')
      navigate('/login')
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/requires-recent-login') {
        toast.error('Для удаления аккаунта требуется повторный вход')
        setShowReauthDialog(true)
      } else {
        showErrorToast(error, { context: 'Delete Account' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReauthenticate = async () => {
    if (!user?.email || !reauthPassword) {
      toast.error('Введите пароль')
      return
    }

    setLoading(true)
    try {
      await settingsService.reauthenticate(user.email, reauthPassword)
      setShowReauthDialog(false)
      setReauthPassword('')
      showSuccessToast('Повторная аутентификация успешна. Попробуйте удалить аккаунт снова.')
    } catch (error: unknown) {
      showErrorToast(error, { context: 'Reauthenticate' })
    } finally {
      setLoading(false)
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
          Удаление аккаунта приведёт к полной потере всех данных (привычки, цели, настройки). Это действие необратимо.
        </p>
        <Button
          data-testid="delete-account-btn"
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
        >
          {loading ? 'Удаление...' : 'Удалить аккаунт'}
        </Button>
      </div>

      {showReauthDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div data-testid="reauth-dialog" className="glass-panel p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4">Подтверждение личности</h3>
            <p className="text-white/60 text-sm mb-4">
              Для удаления аккаунта требуется повторный вход. Введите ваш пароль:
            </p>
            <Input
              type="password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              placeholder="Введите пароль"
              className="bg-white/5 border-white/10 text-white mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleReauthenticate()
              }}
            />
            <div className="flex gap-3">
              <Button
                onClick={handleReauthenticate}
                disabled={loading}
                className="flex-1 bg-primary text-white"
              >
                {loading ? 'Проверка...' : 'Подтвердить'}
              </Button>
              <Button
                data-testid="reauth-cancel-btn"
                onClick={() => {
                  setShowReauthDialog(false)
                  setReauthPassword('')
                }}
                disabled={loading}
                className="flex-1 bg-white/10 text-white"
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsForm

