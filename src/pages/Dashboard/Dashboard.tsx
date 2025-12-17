import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector, type RootState } from '../../app/store'
import { fetchHabits, checkInHabit, toggleLocalComplete } from '../../features/habits/habitsSlice'
import { fetchGoals } from '../../features/goals/goalsSlice'
import { fetchTodos, addTodo, toggleTodo, deleteTodo, updateTodo } from '../../features/todos/todosSlice'
import AppLayout from '../../components/Layout/AppLayout'
import Status from '../../components/Status/Status'
import ChallengeWidget from '../../components/ChallengeWidget'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'
import type { Todo } from '../../types'

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: habits, loading: habitsLoading, error: habitsError } = useAppSelector((s: RootState) => s.habits)
  const { items: goals, loading: goalsLoading, error: goalsError } = useAppSelector((s: RootState) => s.goals)
  const { items: todos, loading: todosLoading } = useAppSelector((s: RootState) => s.todos)
  const userId = useAppSelector((s: RootState) => s.user.me?.id)

  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false)
  const [todoTitle, setTodoTitle] = useState('')
  const [todoDescription, setTodoDescription] = useState('')
  const [todoDeadline, setTodoDeadline] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDeadline, setEditDeadline] = useState('')

  useEffect(() => {
    if (userId) {
      dispatch(fetchHabits(userId))
      dispatch(fetchGoals(userId))
      dispatch(fetchTodos(userId))
    }
  }, [dispatch, userId])

  const loading = habitsLoading || goalsLoading || todosLoading
  const error = habitsError ?? goalsError

  const handleRetry = () => {
    if (userId) {
      dispatch(fetchHabits(userId))
      dispatch(fetchGoals(userId))
      dispatch(fetchTodos(userId))
    }
  }

  const handleAddTodo = async () => {
    const { auth } = await import('../../firebase')

    if (!todoTitle.trim()) {
      toast.error('Введите название задачи')
      return
    }

    const actualUserId = auth.currentUser?.uid
    if (!actualUserId) {
      toast.error('Необходима авторизация')
      return
    }

    if (userId !== actualUserId) {
      console.warn('userId mismatch! Redux:', userId, 'Firebase:', actualUserId)
    }

    try {
      await dispatch(addTodo({
        title: todoTitle,
        description: todoDescription,
        deadline: todoDeadline,
        userId: actualUserId,
      })).unwrap()
      toast.success('Задача добавлена!')
      setTodoTitle('')
      setTodoDescription('')
      setTodoDeadline('')
      setIsTodoDialogOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const low = errorMessage.toLowerCase()
      if (low.includes('permission') || low.includes('insufficient') || low.includes('missing or insufficient permissions')) {
        toast.error('Операция не разрешена сервером Firestore (Missing or insufficient permissions). Проверьте и опубликуйте правила Firestore или используйте Firebase Emulator. См. README или инструкцию в проекте.')
        return
      }
      toast.error(`Ошибка: ${errorMessage}`)
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await dispatch(toggleTodo({ id, completed })).unwrap()
      toast.success(completed ? 'Задача возвращена' : 'Задача выполнена!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        toast.error('Нет прав на обновление задачи в Firestore. Проверьте правила безопасности Firestore.')
        return
      }
      toast.error('Не удалось обновить задачу')
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await dispatch(deleteTodo(id)).unwrap()
      toast.success('Задача удалена')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        toast.error('Нет прав на удаление задачи в Firestore. Проверьте правила безопасности Firestore.')
        return
      }
      toast.error('Ошибка при удалении задачи')
    }
  }

  const handleToggleHabit = async (id: string) => {
    if (!userId) return
    const today = new Date().toISOString().split('T')[0]
    const habit = habits.find((h) => h.id === id)
    if (!habit) return

    dispatch(toggleLocalComplete(id))

    try {
      await dispatch(checkInHabit({ id, date: today })).unwrap()
      toast.success(habit.completed ? 'Отметка снята' : 'Привычка отмечена!')
    } catch {
      dispatch(toggleLocalComplete(id))
      toast.error('Не удалось обновить привычку')
    }
  }

  const todayHabits = habits.slice(0, 3)
  const activeGoals = goals.filter(g => !g.completed).slice(0, 2)
  const activeTodos = todos.filter(t => !t.completed)

  const openEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title || '')
    setEditDescription(todo.description || '')
    setEditDeadline(todo.deadline || '')
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    const payload = { title: editTitle.trim(), description: editDescription.trim() || undefined, deadline: editDeadline || undefined }
    try {
      await dispatch(updateTodo({ id: editingId, data: payload })).unwrap()
      toast.success('Задача обновлена')
      setIsEditDialogOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        toast.error('Нет прав на обновление задачи в Firestore. Проверьте правила безопасности Firestore.')
        return
      }
      toast.error('Не удалось сохранить изменения')
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Главная</p>
            <p className="text-white/60 text-base font-normal leading-normal">Вот ваш прогресс на сегодня. Продолжайте!</p>
          </div>

          <Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-accent/10 text-accent text-sm font-bold leading-normal tracking-[0.015em] border border-accent/80 shadow-glow-gold hover:shadow-glow-gold-hover transition-shadow duration-300">
                <span className="truncate">+ Добавить задачу</span>
              </button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Создать новую задачу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="dashboard-todo-title" className="text-white/80 text-sm mb-2 block">Название</label>
                  <Input
                    id="dashboard-todo-title"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Например: Купить продукты"
                  />
                </div>
                <div>
                  <label htmlFor="dashboard-todo-description" className="text-white/80 text-sm mb-2 block">Описание (опционально)</label>
                  <Textarea
                    id="dashboard-todo-description"
                    value={todoDescription}
                    onChange={(e) => setTodoDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    placeholder="Детали задачи..."
                  />
                </div>
                <div>
                  <label htmlFor="dashboard-todo-deadline" className="text-white/80 text-sm mb-2 block">Дедлайн (опционально)</label>
                  <Input
                    id="dashboard-todo-deadline"
                    type="datetime-local"
                    value={todoDeadline}
                    onChange={(e) => setTodoDeadline(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTodo} className="bg-primary text-white hover:bg-primary/90">
                  Создать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">Повседневные задачи</h2>
              {todosLoading ? (
                <div className="text-white/60">Загрузка задач...</div>
              ) : activeTodos.length === 0 ? (
                <div className="text-white/60">Нет активных задач. Создайте первую задачу!</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeTodos.map((todo) => (
                    <div key={todo.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3 group">
                      <input
                        className="h-5 w-5 mt-0.5 rounded border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all duration-300 cursor-pointer"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id, todo.completed)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-white font-medium ${todo.completed ? 'line-through text-white/50' : ''}`}>
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="text-white/60 text-sm mt-1">{todo.description}</p>
                        )}
                        {todo.deadline && (
                          <p className="text-accent text-xs mt-2">
                            📅 {new Date(todo.deadline).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(todo)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-accent"
                          aria-label="Редактировать задачу"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400"
                          aria-label="Удалить задачу"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="glass-panel p-6">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">Фокус на сегодня</h2>
              {habitsLoading ? (
                <div className="text-white/60">Загрузка привычек...</div>
              ) : todayHabits.length === 0 ? (
                <div className="text-white/60">Нет привычек. Создайте первую привычку чтобы начать!</div>
              ) : (
                <div className="flex flex-col divide-y divide-white/10">
                  {todayHabits.map((habit) => (
                    <label key={habit.id} className="flex gap-x-4 py-4 items-center cursor-pointer group">
                      <input
                        className="h-5 w-5 rounded-full border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 appearance-none transition-all duration-300 group-hover:border-primary cursor-pointer"
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => handleToggleHabit(habit.id)}
                      />
                      <p className={`text-base font-normal leading-normal transition-colors ${habit.completed ? 'text-white/50 line-through' : 'text-white/80 group-hover:text-white'}`}>
                        {habit.title}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">Активные цели</h2>
              {goalsLoading ? (
                <div className="text-white/60">Загрузка целей...</div>
              ) : activeGoals.length === 0 ? (
                <div className="text-white/60">Нет активных целей. Создайте первую цель!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeGoals.map((goal) => (
                    <div key={goal.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-3">
                      <p className="text-white font-semibold">{goal.title}</p>
                      <div className="w-full bg-black/20 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${goal.progress || 0}%`,
                            boxShadow: '0 0 8px rgba(190, 52, 213, 0.7)'
                          }}
                        />
                      </div>
                      <p className="text-sm text-white/60">{goal.progress || 0}% завершено</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <ChallengeWidget />

            <div className="glass-panel p-6">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">Быстрая статистика</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Всего привычек</span>
                  <span className="text-white font-bold text-xl">{habits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Активных целей</span>
                  <span className="text-white font-bold text-xl">{goals.filter(g => !g.completed).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Процент выполнения</span>
                  <span className="text-white font-bold text-xl">
                    {habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Status loading={loading} error={error as string | null} onRetry={handleRetry} />
      {isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-panel border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать задачу</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="dashboard-edit-title" className="text-white/80 text-sm mb-2 block">Название</label>
                <Input id="dashboard-edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label htmlFor="dashboard-edit-desc" className="text-white/80 text-sm mb-2 block">Описание</label>
                <Textarea id="dashboard-edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label htmlFor="dashboard-edit-deadline" className="text-white/80 text-sm mb-2 block">Дедлайн</label>
                <Input id="dashboard-edit-deadline" type="datetime-local" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEdit} className="bg-primary text-white">
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  )
}

export default Dashboard
