import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import type { Todo } from '../../types'
import { fetchTodos, addTodo, toggleTodo, deleteTodo, updateTodo } from '../../features/todos/todosSlice'
import AppLayout from '../../components/Layout/AppLayout'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'

const TodosPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: todos, loading } = useAppSelector((s) => s.todos)
  const userId = useAppSelector((s) => s.user.me?.id)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDeadline, setEditDeadline] = useState('')

  useEffect(() => {
    if (userId) {
      dispatch(fetchTodos(userId))
    }
  }, [dispatch, userId])

  const handleAddTodo = async () => {
    if (!title.trim()) {
      toast.error('Введите название задачи')
      return
    }

    const { auth } = await import('../../firebase')
    const actualUserId = auth.currentUser?.uid

    if (!actualUserId) {
      toast.error('Необходима авторизация')
      return
    }

    try {
      await dispatch(addTodo({
        title,
        description,
        deadline,
        userId: actualUserId,
      })).unwrap()
      toast.success('Задача добавлена!')
      setTitle('')
      setDescription('')
      setDeadline('')
      setIsDialogOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании задачи'
      toast.error(errorMessage)
    }
  }

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
        toast.error('Нет прав на обновление задачи в Firestore. Проверьте правила безопасности Firestore и опубликуйте их.')
        return
      }
      toast.error('Не удалось сохранить изменения')
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await dispatch(toggleTodo({ id, completed })).unwrap()
      toast.success(completed ? 'Задача возвращена' : 'Задача выполнена!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
        toast.error('Нет прав на обновление задачи в Firestore. Проверьте правила безопасности Firestore и опубликуйте их.')
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
        toast.error('Нет прав на удаление задачи в Firestore. Проверьте правила безопасности Firestore и опубликуйте их.')
        return
      }
      toast.error('Ошибка при удалении задачи')
    }
  }

  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Задачи</p>
            <p className="text-white/60 text-base font-normal leading-normal">Управляйте своими повседневными задачами.</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-accent/10 text-accent text-sm font-bold leading-normal tracking-[0.015em] border border-accent/80 shadow-glow-gold hover:shadow-glow-gold-hover transition-shadow duration-300"
              >
                <span className="truncate">+ Добавить задачу</span>
              </button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Создать новую задачу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="todo-title" className="text-white/80 text-sm mb-2 block">Название</label>
                  <Input
                    id="todo-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Например: Купить продукты"
                  />
                </div>
                <div>
                  <label htmlFor="todo-description" className="text-white/80 text-sm mb-2 block">Описание (опционально)</label>
                  <Textarea
                    id="todo-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    placeholder="Детали задачи..."
                  />
                </div>
                <div>
                  <label htmlFor="todo-deadline" className="text-white/80 text-sm mb-2 block">Дедлайн (опционально)</label>
                  <Input
                    id="todo-deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
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

        {loading ? (
          <div className="text-white/60 text-center py-12">Загрузка задач...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 glass-panel p-8">
            <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">task_alt</span>
            <p className="text-white/60">Нет задач. Создайте первую задачу чтобы начать!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 mb-4 border-b border-white/10">
                Активные задачи ({activeTodos.length})
              </h2>
              {activeTodos.length === 0 ? (
                <div className="text-white/60 text-center py-8">Нет активных задач</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeTodos.map((todo) => (
                    <div key={todo.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3 group hover:border-primary/30 transition-colors">
                      <input
                        className="h-5 w-5 mt-0.5 rounded border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all duration-300 cursor-pointer"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id, todo.completed)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">{todo.title}</p>
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
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 mb-4 border-b border-white/10">
                Выполненные задачи ({completedTodos.length})
              </h2>
              {completedTodos.length === 0 ? (
                <div className="text-white/60 text-center py-8">Нет выполненных задач</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {completedTodos.map((todo) => (
                    <div key={todo.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3 group opacity-70 hover:opacity-100 transition-opacity">
                      <input
                        className="h-5 w-5 mt-0.5 rounded border-white/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all duration-300 cursor-pointer"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id, todo.completed)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 font-medium line-through">{todo.title}</p>
                        {todo.description && (
                          <p className="text-white/40 text-sm mt-1 line-through">{todo.description}</p>
                        )}
                        {todo.deadline && (
                          <p className="text-white/40 text-xs mt-2">
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
          </div>
        )}

        {isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="glass-panel border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Редактировать задачу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="text-white/80 text-sm mb-2 block">Название</label>
                  <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label htmlFor="edit-desc" className="text-white/80 text-sm mb-2 block">Описание</label>
                  <Textarea id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label htmlFor="edit-deadline" className="text-white/80 text-sm mb-2 block">Дедлайн</label>
                  <Input id="edit-deadline" type="datetime-local" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} className="bg-white/5 border-white/10 text-white" />
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
      </div>
    </AppLayout>
  )
}

export default TodosPage
