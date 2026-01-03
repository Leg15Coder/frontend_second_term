import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchMe, logoutUser, deleteUserAccount } from '../../features/user/userSlice'
import AppLayout from '../../components/Layout/AppLayout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { me, loading, error, isAuthenticated } = useAppSelector((s) => s.user)
  const [isReauthOpen, setIsReauthOpen] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login')
      return
    }
    if (isAuthenticated && !me) {
      dispatch(fetchMe())
    }
  }, [dispatch, isAuthenticated, me, loading, navigate])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Вы вышли из аккаунта')
      navigate('/login')
    } catch {
      toast.error('Ошибка при выходе')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteUserAccount()).unwrap()
      toast.success('Аккаунт удален')
      navigate('/')
    } catch {
      toast.error('Ошибка при удалении аккаунта')
    }
  }

  const handleRetry = () => {
    dispatch(fetchMe())
  }

  if (loading && !error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="glass-panel p-6 text-center max-w-md">
            <p className="text-red-400 mb-4">Ошибка загрузки профиля</p>
            <p className="text-white/60 mb-4 text-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors"
            >
              Повторить попытку
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Профиль</p>
          <p className="text-white/60 text-base font-normal leading-normal">Управление вашим профилем</p>
        </div>

        {me ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-panel p-6">
              <h2 className="text-white text-xl font-bold mb-4">Информация о профиле</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 border-2 border-accent/50"
                    style={{ backgroundImage: `url(${me.photoURL || '/placeholder-avatar.svg'})` }}
                  />
                  <div>
                    <p className="text-white font-semibold text-lg">{me.name || 'Пользователь'}</p>
                    <p className="text-white/60 text-sm">{me.email || 'Email не указан'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-white text-xl font-bold mb-4">Действия</h2>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span>Выйти из аккаунта</span>
                </button>

                <Dialog open={isReauthOpen} onOpenChange={setIsReauthOpen}>
                  <DialogTrigger asChild>
                    <button
                      data-testid="delete-account-btn"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete_forever</span>
                      <span>Удалить аккаунт</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel border-white/20" data-testid="reauth-dialog">
                    <DialogHeader>
                      <DialogTitle className="text-white">Подтверждение удаления</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-white/80">Для удаления аккаунта введите ваш пароль.</p>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsReauthOpen(false)} data-testid="reauth-cancel-btn">
                        Отмена
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={!password}
                      >
                        Удалить навсегда
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 text-center">
            <p className="text-white/60">Профиль не найден</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default ProfilePage
