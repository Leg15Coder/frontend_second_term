import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/store'
import { fetchChallenges, joinChallenge, leaveChallenge, checkInChallenge, undoCheckIn } from '../features/challenges/challengesSlice'
import { toast } from 'sonner'

const ChallengeWidget: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: challenges, loading, error } = useAppSelector((s) => s.challenges)
  const user = useAppSelector((s) => s.user.me)

  useEffect(() => {
    console.log('[ChallengeWidget] Fetching challenges...')
    dispatch(fetchChallenges())
  }, [dispatch])

  useEffect(() => {
    console.log('[ChallengeWidget] Redux challenges updated:', {
      count: challenges.length,
      items: challenges.map(c => ({ id: c.id, title: c.title, participants: c.participants?.length || 0 }))
    })
  }, [challenges])

  const currentChallenge = React.useMemo(() => {
    console.log('[ChallengeWidget] Computing currentChallenge from challenges:', challenges.length)
    if (!challenges?.length) {
      console.log('[ChallengeWidget] No challenges available!')
      return undefined
    }
    const demo = challenges.find((c) => c.id === 'demo-30-day-challenge')
    if (demo) {
      console.log('[ChallengeWidget] Found demo-30-day-challenge:', {
        id: demo.id,
        participants: demo.participants?.length || 0,
        participantsList: demo.participants
      })
      return demo
    }
    console.log('[ChallengeWidget] demo-30-day-challenge NOT FOUND! Using fallback...')
    return challenges.reduce((best, ch) => {
      const bestCount = best?.participants?.length ?? 0
      const chCount = ch?.participants?.length ?? 0
      return chCount > bestCount ? ch : best
    }, challenges[0])
  }, [challenges])

  useEffect(() => {
    if (currentChallenge && user) {
      console.log('[ChallengeWidget] Current state:', {
        challengeId: currentChallenge.id,
        userId: user.id,
        participants: currentChallenge.participants,
        isParticipating: currentChallenge.participants?.includes(user.id)
      })
    }
  }, [currentChallenge, user])

  if (loading && !currentChallenge) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!currentChallenge) {
    return (
      <div className="glass-panel p-6">
        <p className="text-white/60 text-sm">Нет доступных вызовов</p>
      </div>
    )
  }

  const userId = user?.id ?? ''
  const participants = currentChallenge?.participants ?? []
  const isParticipating = userId && participants.includes(userId)
  const userChecks = currentChallenge?.dailyChecks?.[userId] ?? []
  const today = new Date().toISOString().split('T')[0]
  const checkedInToday = userChecks.includes(today)
  const progress = currentChallenge && currentChallenge.days > 0 ? (userChecks.length / currentChallenge.days) * 100 : 0

  const handleJoin = async () => {
    if (!userId) {
      toast.error('Необходимо авторизоваться')
      return
    }

    console.log('[ChallengeWidget] Joining challenge:', {
      challengeId: currentChallenge.id,
      userId,
      currentParticipants: participants
    })

    try {
      const result = await dispatch(joinChallenge({ challengeId: currentChallenge.id, userId })).unwrap()
      console.log('[ChallengeWidget] Join successful! New state:', {
        participants: result.participants,
        isNowParticipating: result.participants?.includes(userId)
      })
      console.log('[ChallengeWidget] Redux state after join:', {
        allChallenges: challenges.length,
        firstChallenge: challenges[0]
      })
      toast.success('Вы присоединились к вызову!')
    } catch (error) {
      console.error('[ChallengeWidget] Join failed with error:', error)
      console.error('[ChallengeWidget] Error type:', typeof error)
      console.error('[ChallengeWidget] Error details:', JSON.stringify(error, null, 2))

      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('denied')) {
        toast.error('Ошибка доступа к Firestore! Проверьте правила безопасности.')
        console.error('[ChallengeWidget] FIRESTORE PERMISSION DENIED! Правила не опубликованы!')
      } else {
        toast.error(`Не удалось присоединиться: ${errorMessage}`)
      }
    }
  }

  const handleLeave = async () => {
    if (!userId) return
    try {
      await dispatch(leaveChallenge({ challengeId: currentChallenge.id, userId })).unwrap()
      toast.success('Вы покинули вызов')
    } catch {
      toast.error('Не удалось покинуть вызов')
    }
  }

  const handleCheckIn = async () => {
    if (!userId) {
      toast.error('Необходимо авторизоваться')
      return
    }
    if (!isParticipating) {
      toast.error('Сначала присоединитесь к вызову')
      return
    }
    try {
      await dispatch(checkInChallenge({ challengeId: currentChallenge.id, userId })).unwrap()
      toast.success('День отмечен!')
    } catch {
      toast.error('Не удалось отметить день')
    }
  }

  const handleUndoCheckIn = async () => {
    if (!userId) {
      toast.error('Необходимо авторизоваться')
      return
    }
    try {
      await dispatch(undoCheckIn({ challengeId: currentChallenge.id, userId })).unwrap()
      toast.success('Отметка отменена')
    } catch {
      toast.error('Не удалось отменить отметку')
    }
  }

  return (
    <div className="glass-panel p-6" data-testid="challenge-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">Текущий вызов</h3>
        {isParticipating && (
          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">Участвуете</span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-white font-semibold text-lg mb-1">{currentChallenge.title}</h4>
          {currentChallenge.description && (
            <p className="text-white/60 text-sm mb-3">{currentChallenge.description}</p>
          )}
          <p className="text-white/80 text-sm">Продолжительность: {currentChallenge.days} дней</p>
        </div>

        {isParticipating && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Прогресс</span>
                <span className="text-white text-sm font-semibold">
                  {userChecks.length} / {currentChallenge.days} дней
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                data-testid="challenge-checkin-btn"
                onClick={handleCheckIn}
                disabled={checkedInToday}
                aria-label={checkedInToday ? 'Уже отмечено сегодня' : 'Отметить день как выполненный'}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  checkedInToday
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : 'bg-accent/20 text-accent hover:bg-accent/30'
                }`}
              >
                {checkedInToday ? '✓ Отмечено сегодня' : 'Отметить день'}
              </button>
              {checkedInToday && (
                <button
                  data-testid="challenge-undo-btn"
                  onClick={handleUndoCheckIn}
                  aria-label="Отменить отметку"
                  className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                >
                  Отменить
                </button>
              )}
              <button
                onClick={handleLeave}
                aria-label="Покинуть вызов"
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Выйти
              </button>
            </div>
          </>
        )}

        {!isParticipating && (
          <button
            onClick={handleJoin}
            aria-label="Присоединиться к вызову"
            className="w-full px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            Присоединиться
          </button>
        )}

        {participants.length > 0 && (
          <p className="text-white/60 text-xs">
            Участников: {participants.length}
          </p>
        )}
      </div>
    </div>
  )
}

export default ChallengeWidget

