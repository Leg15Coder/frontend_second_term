import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/store'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const user = useAppSelector((s) => s.user.me)

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Главная', filled: true },
    { path: '/habits', icon: 'checklist', label: 'Привычки' },
    { path: '/goals', icon: 'flag', label: 'Цели' },
    { path: '/todos', icon: 'task_alt', label: 'Задачи' },
    { path: '/challenges', icon: 'shield', label: 'Вызовы' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 p-4 flex-shrink-0">
      <div className="flex h-full flex-col justify-between glass-panel p-4">
        <div className="flex flex-col gap-4">
          <Link
            to="/profile"
            className="flex gap-3 items-center hover:bg-white/5 rounded-lg p-2 -ml-2 transition-colors cursor-pointer"
            aria-label="Открыть профиль"
            title="Перейти в профиль"
          >
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-accent/50"
              style={{ backgroundImage: `url(${user?.photoURL || '/placeholder-avatar.svg'})` }}
            />
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">{user?.name || 'Пользователь'}</h1>
              <p className="text-white/60 text-sm font-normal leading-normal">С возвращением</p>
            </div>
          </Link>

          <div className="flex flex-col gap-2 mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-white/10 border border-white/20'
                    : 'hover:bg-white/5'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive(item.path) ? 'text-accent' : 'text-white/80'}`}
                  style={item.filled && isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <p className={`text-sm font-medium leading-normal ${isActive(item.path) ? 'text-white' : 'text-white/80'}`}>
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-white/80">settings</span>
            <p className="text-white/80 text-sm font-medium leading-normal">Настройки</p>
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
