import React, { useState, useEffect } from 'react'
import AppLayout from '../../components/Layout/AppLayout'
import { useAppSelector, useAppDispatch } from '../../app/store'
import { fetchHabits } from '../../features/habits/habitsSlice'
import { fetchGoals } from '../../features/goals/goalsSlice'
import { fetchChallenges } from '../../features/challenges/challengesSlice'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { showErrorToast } from '../../lib/toast'

interface DayActivity {
  date: string
  habits: number
  goals: number
  challenges: number
  totalCompleted: number
}

interface CalendarData {
  [date: string]: DayActivity
}

const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.user.me)
  const habits = useAppSelector((s) => s.habits.items)
  const goals = useAppSelector((s) => s.goals.items)
  const challenges = useAppSelector((s) => s.challenges.items)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchHabits(user.id))
      dispatch(fetchGoals(user.id))
      dispatch(fetchChallenges())
      loadCalendarData()
    }
  }, [dispatch, user, currentMonth])

  const loadCalendarData = () => {
    try {
      const calData: CalendarData = {}
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        const habitsCount = habits.filter(h =>
          h.datesCompleted?.includes(date)
        ).length

        const goalsCount = goals.filter(g =>
          g.tasks?.some(t => t.done && g.updatedAt?.startsWith(date))
        ).length

        const challengesCount = challenges.filter(c =>
          user?.id && c.dailyChecks?.[user.id]?.includes(date)
        ).length

        const totalCompleted = habitsCount + goalsCount + challengesCount

        if (totalCompleted > 0) {
          calData[date] = {
            date,
            habits: habitsCount,
            goals: goalsCount,
            challenges: challengesCount,
            totalCompleted
          }
        }
      }

      setCalendarData(calData)
    } catch (error) {
      showErrorToast(error, { context: 'Load Calendar' })
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    let firstDayOfWeek = firstDay.getDay()
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    const days: (number | null)[] = []

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
  }

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
  }

  const getActivityColor = (total: number): string => {
    if (total === 0) return 'bg-white/5'
    if (total <= 2) return 'bg-green-500/20'
    if (total <= 4) return 'bg-green-500/40'
    if (total <= 6) return 'bg-green-500/60'
    return 'bg-green-500/80'
  }

  const handleExport = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const monthStr = String(month + 1).padStart(2, '0')

    let csv = 'Date,Habits,Goals,Challenges,Total\n'

    Object.values(calendarData).forEach(activity => {
      csv += `${activity.date},${activity.habits},${activity.goals},${activity.challenges},${activity.totalCompleted}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calendar-${year}-${monthStr}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const days = getDaysInMonth()
  const selectedActivity = selectedDate ? calendarData[selectedDate] : null

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Календарь</p>
            <p className="text-white/60 text-base font-normal leading-normal">
              Просматривайте историю своих достижений
            </p>
          </div>

          <Button data-testid="calendar-export-btn" onClick={handleExport} variant="outline" className="bg-accent/10 text-accent border-accent/50">
            <span className="material-symbols-outlined text-sm mr-2">download</span>
            Экспорт CSV
          </Button>
        </div>

        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 data-testid="calendar-month" className="text-white text-2xl font-bold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <Button data-testid="calendar-prev-month" onClick={handlePreviousMonth} variant="outline" size="sm">
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              <Button data-testid="calendar-today-btn" onClick={handleToday} variant="outline" size="sm">
                Сегодня
              </Button>
              <Button data-testid="calendar-next-month" onClick={handleNextMonth} variant="outline" size="sm">
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>

          <>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center text-white/60 text-sm font-semibold py-2">
                  {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }

                  const year = currentMonth.getFullYear()
                  const month = currentMonth.getMonth()
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const activity = calendarData[dateStr]
                  const isToday = new Date().toISOString().split('T')[0] === dateStr
                  const isSelected = selectedDate === dateStr

                  return (
                    <button
                      key={day}
                      data-testid="calendar-day"
                      data-date={dateStr}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square rounded-lg p-2 transition-all hover:scale-105 ${
                        isToday ? 'ring-2 ring-accent' : ''
                      } ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      } ${
                        activity ? getActivityColor(activity.totalCompleted) : 'bg-white/5'
                      } hover:bg-white/10`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-white text-sm font-semibold">{day}</span>
                        {activity && (
                          <span className="text-white/60 text-xs mt-1">
                            {activity.totalCompleted}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
        </div>

        {selectedActivity && (
          <Card className="glass-panel p-6">
            <h3 className="text-white text-xl font-bold mb-4">
              Детали за {selectedDate}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-white/80 font-semibold">Привычки</span>
                </div>
                <p className="text-white text-2xl font-bold">{selectedActivity.habits}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-accent">flag</span>
                  <span className="text-white/80 font-semibold">Цели</span>
                </div>
                <p className="text-white text-2xl font-bold">{selectedActivity.goals}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-yellow-500">military_tech</span>
                  <span className="text-white/80 font-semibold">Челленджи</span>
                </div>
                <p className="text-white text-2xl font-bold">{selectedActivity.challenges}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="glass-panel p-6">
          <h3 className="text-white text-xl font-bold mb-4">Легенда</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/5" />
              <span className="text-white/60 text-sm">Нет активности</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500/20" />
              <span className="text-white/60 text-sm">1-2 активности</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500/40" />
              <span className="text-white/60 text-sm">3-4 активности</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500/60" />
              <span className="text-white/60 text-sm">5-6 активностей</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500/80" />
              <span className="text-white/60 text-sm">7+ активностей</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default CalendarPage

