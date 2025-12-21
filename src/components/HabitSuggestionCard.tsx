import React from 'react'
import type { Habit } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface HabitSuggestionCardProps {
  habit: Habit
  onAccept: (habit: Habit) => void
  onReject: (habitId: string) => void
}

const HabitSuggestionCard: React.FC<HabitSuggestionCardProps> = ({
  habit,
  onAccept,
  onReject
}) => {
  const getConfidenceColor = (): string => {
    if (!habit.confidence) return 'text-orange-400'
    if (habit.confidence >= 0.7) return 'text-green-400'
    if (habit.confidence >= 0.5) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const confidenceColor = getConfidenceColor()

  const frequencyLabel: string = ({
    daily: 'Ежедневно',
    weekdays: 'По будням',
    custom: 'Выборочно',
    every_n_days: `Каждые ${habit.everyNDays || 1} дней`
  } as Record<string, string>)[habit.frequency || 'daily'] || 'Ежедневно'

  const difficultyLabel: string = ({
    low: 'Лёгкая',
    medium: 'Средняя',
    hard: 'Сложная'
  } as Record<string, string>)[habit.difficulty || 'medium'] || 'Средняя'

  return (
    <Card className="glass-panel p-4 border-accent/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-accent text-sm">auto_awesome</span>
            <h4 className="text-white font-semibold">{habit.title}</h4>
          </div>
          {habit.description && (
            <p className="text-white/60 text-sm">{habit.description}</p>
          )}
        </div>
        {habit.confidence !== undefined && (
          <div className="ml-2">
            <span className={`text-xs font-semibold ${confidenceColor}`}>
              {Math.round(habit.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
          {frequencyLabel}
        </span>
        <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
          {difficultyLabel}
        </span>
        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
          Предложение ИИ
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onAccept(habit)}
          className="flex-1 bg-accent text-white hover:bg-accent/80"
          size="sm"
        >
          <span className="material-symbols-outlined text-sm mr-1">check</span>
          {' '}Принять
        </Button>
        <Button
          onClick={() => onReject(habit.id)}
          variant="outline"
          className="flex-1 border-white/20 text-white/80 hover:bg-white/10"
          size="sm"
        >
          <span className="material-symbols-outlined text-sm mr-1">close</span>
          {' '}Отклонить
        </Button>
      </div>
    </Card>
  )
}

export default HabitSuggestionCard

