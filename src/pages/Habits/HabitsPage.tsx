import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchHabits, createHabit, updateHabit, deleteHabit, toggleLocalComplete } from '../../features/habits/habitsSlice'
import AppLayout from '../../components/Layout/AppLayout'
import { Button } from '../../components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const habitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekdays', 'custom', 'every_n_days']).optional(),
  everyNDays: z.number().min(1).max(365).optional(),
  difficulty: z.enum(['low', 'medium', 'hard']).optional(),
})

type HabitFormValues = z.infer<typeof habitSchema>

const HabitsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.habits)
  const userId = useAppSelector((s) => s.user.me?.id)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: '',
      description: '',
      frequency: 'daily',
      everyNDays: 1,
      difficulty: 'medium'
    }
  })

  useEffect(() => {
    if (userId) {
      dispatch(fetchHabits(userId))
    }
  }, [dispatch, userId])

  const onSubmit = async (values: HabitFormValues) => {
    if (editing) {
      await dispatch(updateHabit({ id: editing, data: values }))
    } else {
      await dispatch(createHabit({ ...values, completed: false }))
    }
    setIsOpen(false)
    setEditing(null)
    form.reset()
  }

  const handleEdit = (id: string) => {
    const h = items.find((x) => x.id === id)
    if (!h) return
    setEditing(id)
    form.reset({
      title: h.title,
      description: h.description ?? '',
      frequency: h.frequency ?? 'daily',
      everyNDays: h.everyNDays ?? 1,
      difficulty: h.difficulty ?? 'medium'
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this habit?')) {
      await dispatch(deleteHabit(id))
    }
  }

  const handleToggleHabit = async (id: string) => {
    const habit = items.find((h) => h.id === id)
    if (!habit || !userId) return

    dispatch(toggleLocalComplete(id))

    try {
      await dispatch(updateHabit({
        id,
        data: { completed: !habit.completed, userId }
      })).unwrap()
    } catch {
      dispatch(toggleLocalComplete(id))
      toast.error('Ошибка при обновлении привычки')
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Привычки</p>
            <p className="text-white/60 text-base font-normal leading-normal">Отслеживайте свои ежедневные ритуалы и создавайте последовательность.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => { setEditing(null); form.reset(); setIsOpen(true); }}
                className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-accent/10 text-accent text-sm font-bold leading-normal tracking-[0.015em] border border-accent/80 shadow-glow-gold hover:shadow-glow-gold-hover transition-shadow duration-300"
              >
                <span className="truncate">+ Добавить привычку</span>
              </button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">{editing ? 'Редактировать привычку' : 'Создать новую привычку'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Название</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10 text-white" placeholder="например: Утренняя медитация" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Описание (опционально)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10 text-white" placeholder="например: 15 минут осознанности" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Периодичность</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Выберите периодичность" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1a1f2e] border-white/10">
                            <SelectItem value="daily" className="text-white hover:bg-white/10">Ежедневно</SelectItem>
                            <SelectItem value="weekdays" className="text-white hover:bg-white/10">По будням</SelectItem>
                            <SelectItem value="every_n_days" className="text-white hover:bg-white/10">Каждые N дней</SelectItem>
                            <SelectItem value="custom" className="text-white hover:bg-white/10">Выборочно</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch('frequency') === 'every_n_days' && (
                    <FormField
                      control={form.control}
                      name="everyNDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Каждые (дней)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={365}
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                              className="bg-white/5 border-white/10 text-white"
                              placeholder="например: 3"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-white/50">Привычка будет повторяться каждые указанное количество дней</p>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Сложность</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Выберите сложность" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1a1f2e] border-white/10">
                            <SelectItem value="low" className="text-white hover:bg-white/10">Низкая</SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-white/10">Средняя</SelectItem>
                            <SelectItem value="hard" className="text-white hover:bg-white/10">Высокая</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
                      {editing ? 'Обновить' : 'Создать'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-white/60 text-center py-12">Загрузка привычек...</div>
        ) : error ? (
          <div className="text-red-400 text-center py-12">Ошибка: {error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 glass-panel p-8">
            <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">checklist</span>
            <p className="text-white/60">Нет привычек. Создайте первую привычку чтобы начать!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((habit) => {
              const frequencyLabels: Record<string, string> = {
                daily: 'Ежедневно',
                weekdays: 'По будням',
                every_n_days: habit.everyNDays ? `Каждые ${habit.everyNDays} дн.` : 'Каждые N дней',
                custom: 'Выборочно'
              }
              const difficultyLabels = {
                low: 'Низкая',
                medium: 'Средняя',
                hard: 'Высокая'
              }
              const difficultyColors = {
                low: 'text-green-400',
                medium: 'text-yellow-400',
                hard: 'text-red-400'
              }

              return (
                <div key={habit.id} className="magic-card group">
                  <div className="flex flex-col items-center text-center">
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      className="mb-4 transition-transform hover:scale-110"
                    >
                      <span className={`material-symbols-outlined text-6xl ${habit.completed ? 'text-accent' : 'text-white/50'}`}>
                        {habit.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>
                    <h2 className="text-xl font-bold tracking-wider text-white">{habit.title}</h2>
                    {habit.description && (
                      <p className="text-white/60 text-sm mt-2">{habit.description}</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {habit.frequency && (
                        <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {frequencyLabels[habit.frequency]}
                        </span>
                      )}
                      {habit.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded bg-white/10 border border-white/20 ${difficultyColors[habit.difficulty]}`}>
                          {difficultyLabels[habit.difficulty]}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(habit.id)}
                        aria-label={`Редактировать привычку "${habit.title}"`}
                        className="px-3 py-1 text-xs rounded bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(habit.id)}
                        aria-label={`Удалить привычку "${habit.title}"`}
                        className="px-3 py-1 text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
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

export default HabitsPage
