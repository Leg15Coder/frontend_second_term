import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchGoals, addGoal, updateGoal, deleteGoal } from '../../features/goals/goalsSlice'
import AppLayout from '../../components/Layout/AppLayout'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'
import { splitGoal } from '../../lib/llm/splitGoal'
import { suggestHabitsForGoal } from '../../services/aiService'
import HabitSuggestionCard from '../../components/HabitSuggestionCard'
import type { GoalTask, Habit } from '../../types'

const GoalsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.goals)
  const userId = useAppSelector((s) => s.user.me?.id)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [detailedDescription, setDetailedDescription] = useState('')
  const [progress, setProgress] = useState(0)
  const [tasks, setTasks] = useState<GoalTask[]>([])
  const [generatingTasks, setGeneratingTasks] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [suggestHabits, setSuggestHabits] = useState(true)
  const [suggestedHabits, setSuggestedHabits] = useState<Habit[]>([])
  const [generatingHabits, setGeneratingHabits] = useState(false)

  useEffect(() => {
    if (userId) {
      dispatch(fetchGoals(userId))
    }
  }, [dispatch, userId])

  const handleOpenDialog = (goalId?: string) => {
    if (goalId) {
      const goal = items.find((g) => g.id === goalId)
      if (goal) {
        setEditingId(goalId)
        setTitle(goal.title)
        setDetailedDescription(goal.detailedDescription || '')
        setProgress(goal.progress || 0)
        setTasks(goal.tasks || [])
      }
    } else {
      setEditingId(null)
      setTitle('')
      setDetailedDescription('')
      setProgress(0)
      setTasks([])
    }
    setIsDialogOpen(true)
  }

  const handleGenerateTasks = async () => {
    if (!detailedDescription.trim()) {
      toast.error('Введите подробное описание для генерации задач')
      return
    }

    setGeneratingTasks(true)
    setGenerationError(null)
    try {
      let generatedTasks = await splitGoal(detailedDescription)
      if (!generatedTasks || generatedTasks.length < 3) {
        try {
          const options = { forceDaily: true, tempo: 'normal' as const }
          const retried = await splitGoal(detailedDescription, options)
          if (retried && retried.length >= 1) generatedTasks = retried
        } catch (err) {
          console.warn('GoalsPage: retry generation failed', err)
        }
      }
      setTasks(generatedTasks)
      toast.success(`Сгенерировано ${generatedTasks?.length || 0} подзадач`)
    } catch {
      toast.error('Ошибка при генерации задач')
    } finally {
      setGeneratingTasks(false)
    }
  }

  const handleToggleTask = async (taskId: string, goalId?: string) => {
    if (!goalId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      )
      return
    }

    if (!userId) return

    const goal = items.find(g => g.id === goalId)
    if (!goal?.tasks) return

    const currentTasks = goal.tasks
    const updatedTasks = currentTasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    )

    const updatedProgress = updatedTasks.length > 0
      ? Math.round((updatedTasks.filter((t) => t.done).length / updatedTasks.length) * 100)
      : 0

    try {
      await dispatch(updateGoal({
        id: goalId,
        data: {
          tasks: updatedTasks,
          progress: updatedProgress
        }
      })).unwrap()

      toast.success('Задача обновлена!')
    } catch (error) {
      toast.error('Не удалось обновить задачу')
      console.error('Failed to toggle task:', error)
    }
  }

  const attemptAutoGenerate = async (): Promise<void> => {
    if (tasks.length > 0 || !detailedDescription.trim()) return
    setGeneratingTasks(true)
    setGenerationError(null)
    try {
      const generated = await splitGoal(detailedDescription)
      if (generated && generated.length > 0) setTasks(generated)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setGenerationError(msg)
    } finally {
      setGeneratingTasks(false)
    }
  }

  const handleSaveGoal = async () => {
    if (!title.trim()) {
      toast.error('Введите название цели')
      return
    }

    const calculatedProgress = tasks.length > 0
      ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
      : progress

    try {
      await attemptAutoGenerate()

      if (editingId && userId) {
        await dispatch(updateGoal({
          id: editingId,
          data: {
            title,
            detailedDescription,
            progress: calculatedProgress,
            tasks
          }
        })).unwrap()
        toast.success('Цель обновлена!')
      } else {
        await dispatch(addGoal({
          title,
          detailedDescription,
          progress: calculatedProgress,
          completed: false,
          tasks,
        })).unwrap()
        toast.success('Цель добавлена!')
      }
      setIsDialogOpen(false)
      setEditingId(null)
      setTitle('')
      setDetailedDescription('')
      setProgress(0)
      setTasks([])
    } catch {
      toast.error('Ошибка при сохранении цели')
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      await dispatch(deleteGoal(id)).unwrap()
      toast.success('Цель удалена')
    } catch {
      toast.error('Ошибка при удалении цели')
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Цели</p>
            <p className="text-white/60 text-base font-normal leading-normal">Ставьте амбициозные цели и отслеживайте прогресс.</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleOpenDialog()}
                className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-accent/10 text-accent text-sm font-bold leading-normal tracking-[0.015em] border border-accent/80 shadow-glow-gold hover:shadow-glow-gold-hover transition-shadow duration-300"
              >
                <span className="truncate">+ Добавить цель</span>
              </button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">{editingId ? 'Редактировать цель' : 'Создать новую цель'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="goal-title" className="text-white/80 text-sm mb-2 block">Название</label>
                  <Input
                    id="goal-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Например: Выучить TypeScript"
                  />
                </div>
                <div>
                  <label htmlFor="goal-detailed" className="text-white/80 text-sm mb-2 block">Описание</label>
                  <Textarea
                    id="goal-detailed"
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    placeholder="Опишите цель подробно. Можно использовать список:\n- Шаг 1\n- Шаг 2\n- Шаг 3"
                  />
                </div>
                <div className="mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={suggestHabits} onChange={(e) => setSuggestHabits(e.target.checked)} />
                    <span className="text-white/80 text-sm">Предложить добавить привычки после сохранения</span>
                  </label>
                </div>
                <Button
                  onClick={handleGenerateTasks}
                  disabled={generatingTasks || !detailedDescription.trim()}
                  className="mt-2 bg-accent/20 text-accent hover:bg-accent/30"
                >
                  {generatingTasks ? 'Генерация...' : '✨ Разбить на подзадачи'}
                </Button>
                {generationError && (
                  <p className="text-red-400 text-sm mt-2">Ошибка генерации: {generationError}</p>
                )}
                {tasks.length > 0 && (
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Подзадачи ({tasks.filter(t => t.done).length}/{tasks.length} выполнено)</label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {tasks.map((task) => (
                        <label key={task.id} className="flex items-start gap-2 p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className={`text-white text-sm ${task.done ? 'line-through text-white/50' : ''}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-white/60 text-xs mt-1">{task.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {tasks.length === 0 && (
                  <div>
                    <label htmlFor="goal-progress" className="text-white/80 text-sm mb-2 block">Прогресс: {progress}%</label>
                    <input
                      id="goal-progress"
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleSaveGoal} className="bg-primary text-white hover:bg-primary/90">
                  {editingId ? 'Обновить' : 'Создать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-white/60 text-center py-12">Загрузка целей...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 glass-panel p-8">
            <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">flag</span>
            <p className="text-white/60">Нет целей. Создайте первую цель чтобы начать!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((goal) => {
              const hasTasks = goal.tasks && goal.tasks.length > 0
              return (
                <div key={goal.id} className="glass-panel p-6 hover:border-primary/50 transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-white text-xl font-bold">{goal.title}</h3>
                      {goal.completed && (
                        <span className="material-symbols-outlined text-accent">check_circle</span>
                      )}
                    </div>
                    {goal.detailedDescription && (
                      <p className="text-white/60 text-sm">
                        {goal.detailedDescription.slice(0, 100)}
                        {goal.detailedDescription.length > 100 ? '...' : ''}
                      </p>
                    )}

                    {hasTasks && (
                      <div className="space-y-1">
                        <p className="text-white/70 text-xs">
                          Подзадач: {goal.tasks!.filter(t => t.done).length} / {goal.tasks!.length}
                        </p>
                        <div className="space-y-1">
                          {goal.tasks!.slice(0, 3).map((task) => (
                            <button
                              key={task.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleTask(task.id, goal.id)
                              }}
                              className="flex items-center gap-2 text-xs w-full hover:bg-white/5 p-1 rounded transition-colors"
                            >
                              <span className={`material-symbols-outlined text-sm ${task.done ? 'text-accent' : 'text-white/30'}`}>
                                {task.done ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span className={`text-white/70 ${task.done ? 'line-through' : ''}`}>
                                {task.title.slice(0, 40)}{task.title.length > 40 ? '...' : ''}
                              </span>
                            </button>
                          ))}
                        </div>
                        {goal.tasks!.length > 3 && (
                          <p className="text-white/50 text-xs ml-6">+{goal.tasks!.length - 3} ещё...</p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Прогресс</span>
                        <span className="text-white font-semibold">{goal.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${goal.progress || 0}%`,
                            boxShadow: '0 0 8px rgba(190, 52, 213, 0.7)'
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleOpenDialog(goal.id)}
                        aria-label={`Редактировать цель "${goal.title}"`}
                        className="flex-1 px-3 py-1 text-xs rounded bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        aria-label={`Удалить цель "${goal.title}"`}
                        className="flex-1 px-3 py-1 text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default GoalsPage
