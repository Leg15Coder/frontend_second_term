import React from 'react'
import type { Todo, Habit } from '../types'

interface EisenhowerMatrixProps {
  todos: Todo[]
  habits: Habit[]
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ todos, habits }) => {
  const isUrgent = (item: Todo | Habit): boolean => {
    if ('deadline' in item && item.deadline) {
      const deadline = new Date(item.deadline)
      const now = new Date()
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 3
    }
    return false
  }

  const isImportant = (item: Todo | Habit): boolean => {
    return item.difficulty === 'high' || item.difficulty === 'medium'
  }

  const urgentImportant = [...todos, ...habits].filter(
    (item) => isUrgent(item) && isImportant(item) && !item.completed
  )
  const notUrgentImportant = [...todos, ...habits].filter(
    (item) => !isUrgent(item) && isImportant(item) && !item.completed
  )
  const urgentNotImportant = [...todos, ...habits].filter(
    (item) => isUrgent(item) && !isImportant(item) && !item.completed
  )
  const notUrgentNotImportant = [...todos, ...habits].filter(
    (item) => !isUrgent(item) && !isImportant(item) && !item.completed
  )

  const renderItem = (item: Todo | Habit) => {
    const isHabit = 'frequency' in item
    return (
      <div
        key={item.id}
        className="p-2 bg-white/5 rounded hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-sm text-white/60">
            {isHabit ? 'checklist' : 'task_alt'}
          </span>
          <p className="text-white/80 text-sm flex-1">
            {item.title.slice(0, 40)}
            {item.title.length > 40 ? '...' : ''}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-white text-xl font-bold mb-4">Матрица Эйзенхауэра</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <h3 className="text-white font-semibold text-sm">Срочно и Важно</h3>
          </div>
          <div className="space-y-2 min-h-[100px] max-h-[300px] overflow-y-auto">
            {urgentImportant.length === 0 ? (
              <p className="text-white/40 text-xs">Нет задач</p>
            ) : (
              urgentImportant.map(renderItem)
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <h3 className="text-white font-semibold text-sm">Не срочно, но Важно</h3>
          </div>
          <div className="space-y-2 min-h-[100px] max-h-[300px] overflow-y-auto">
            {notUrgentImportant.length === 0 ? (
              <p className="text-white/40 text-xs">Нет задач</p>
            ) : (
              notUrgentImportant.map(renderItem)
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <h3 className="text-white font-semibold text-sm">Срочно, но не Важно</h3>
          </div>
          <div className="space-y-2 min-h-[100px] max-h-[300px] overflow-y-auto">
            {urgentNotImportant.length === 0 ? (
              <p className="text-white/40 text-xs">Нет задач</p>
            ) : (
              urgentNotImportant.map(renderItem)
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <h3 className="text-white font-semibold text-sm">Не срочно и не Важно</h3>
          </div>
          <div className="space-y-2 min-h-[100px] max-h-[300px] overflow-y-auto">
            {notUrgentNotImportant.length === 0 ? (
              <p className="text-white/40 text-xs">Нет задач</p>
            ) : (
              notUrgentNotImportant.map(renderItem)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EisenhowerMatrix

