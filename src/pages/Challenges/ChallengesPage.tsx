import React, { useEffect } from 'react'
import AppLayout from '../../components/Layout/AppLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchChallenges, joinChallenge, leaveChallenge } from '../../features/challenges/challengesSlice'
import { toast } from 'sonner'

const ChallengesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items: challenges, loading, error } = useAppSelector((s) => s.challenges)
  const user = useAppSelector((s) => s.user.me)

  useEffect(() => {
    dispatch(fetchChallenges())
  }, [dispatch])

  const handleJoinToggle = async (challengeId: string) => {
    if (!user?.id) {
      toast.error('Необходимо авторизоваться')
      return
    }

    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return

    const isParticipating = challenge.participants?.includes(user.id)

    try {
      if (isParticipating) {
        await dispatch(leaveChallenge({ challengeId, userId: user.id })).unwrap()
        toast.success('Вы покинули вызов')
      } else {
        await dispatch(joinChallenge({ challengeId, userId: user.id })).unwrap()
        toast.success('Вы присоединились к вызову!')
      }
    } catch {
      toast.error('Произошла ошибка')
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Вызовы</p>
          <p className="text-white/60 text-base font-normal leading-normal">Присоединяйтесь к вызовам сообщества и соревнуйтесь с друзьями.</p>
        </div>

        {loading && challenges.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12 glass-panel p-8">
            <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">shield</span>
            <p className="text-white/60">Нет доступных вызовов</p>
            <p className="text-white/40 text-sm mt-2">Вызовы будут добавлены администраторами.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const isParticipating = user?.id && challenge.participants?.includes(user.id)
              const userChecks = user?.id ? (challenge.dailyChecks?.[user.id] ?? []) : []
              const progress = challenge.days > 0 ? (userChecks.length / challenge.days) * 100 : 0

              return (
                <div key={challenge.id} className="glass-panel p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white text-xl font-bold">{challenge.title}</h3>
                    {isParticipating && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">Участвуете</span>
                    )}
                  </div>

                  {challenge.description && (
                    <p className="text-white/60 text-sm">{challenge.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>{challenge.days} дней</span>
                  </div>

                  {isParticipating && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm">Прогресс</span>
                        <span className="text-white text-sm font-semibold">
                          {userChecks.length} / {challenge.days}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <span className="material-symbols-outlined text-sm">group</span>
                    <span>{challenge.participants?.length ?? 0} участников</span>
                  </div>

                  <button
                    onClick={() => handleJoinToggle(challenge.id)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                      isParticipating
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-accent text-white hover:bg-accent/80'
                    }`}
                  >
                    {isParticipating ? 'Покинуть' : 'Присоединиться'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default ChallengesPage
