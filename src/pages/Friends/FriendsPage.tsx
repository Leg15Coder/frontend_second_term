import React, { useEffect, useState } from 'react'
import AppLayout from '../../components/Layout/AppLayout'
import { useAppSelector } from '../../app/store'
import { friendsService } from '../../services/friendsService'
import { userService } from '../../services/userService'
import { Button } from '../../components/ui/button'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { User } from '../../types'

interface FriendRequest {
  id: string
  from: string
  to: string
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

const FriendsPage: React.FC = () => {
  const currentUser = useAppSelector((s) => s.user.me)
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  const [friends, setFriends] = useState<User[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [currentUser?.id])

  const loadData = async () => {
    if (!currentUser?.id) return

    setLoading(true)
    try {
      const friendIds = await friendsService.getFriends(currentUser.id)
      const friendsData = await Promise.all(
        friendIds.map(id => userService.getUser(id))
      )
      setFriends(friendsData.filter(Boolean) as User[])

      const reqs = await friendsService.getRequests(currentUser.id)
      setRequests(reqs)
    } catch (err) {
      showErrorToast(err, { context: 'Load Friends' })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    if (!currentUser?.id) return
    try {
      await friendsService.acceptRequest(requestId, currentUser.id)
      showSuccessToast('Запрос принят!')
      await loadData()
    } catch (err) {
      showErrorToast(err, { context: 'Accept Request' })
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    if (!currentUser?.id) return
    try {
      await friendsService.rejectRequest(requestId, currentUser.id)
      showSuccessToast('Запрос отклонён')
      await loadData()
    } catch (err) {
      showErrorToast(err, { context: 'Reject Request' })
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!currentUser?.id) return
    const confirmed = window.confirm('Удалить из друзей?')
    if (!confirmed) return

    try {
      await friendsService.removeFriend(currentUser.id, friendId)
      showSuccessToast('Друг удалён')
      await loadData()
    } catch (err) {
      showErrorToast(err, { context: 'Remove Friend' })
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Друзья</p>
          <p className="text-white/60 text-base font-normal leading-normal">
            Управляйте списком друзей и запросами
          </p>
        </div>

        <div className="flex gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-3 px-4 ${activeTab === 'friends' ? 'text-primary border-b-2 border-primary' : 'text-white/60'}`}
          >
            Мои друзья ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 px-4 ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-white/60'}`}
          >
            Запросы ({requests.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : activeTab === 'friends' ? (
          friends.length === 0 ? (
            <div className="text-center py-12 glass-panel p-8">
              <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">group</span>
              <p className="text-white/60">У вас пока нет друзей</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend) => (
                <div key={friend.id} className="glass-panel p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{friend.name}</h3>
                      {friend.email && (
                        <p className="text-white/60 text-sm">{friend.email}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    Удалить из друзей
                  </Button>
                </div>
              ))}
            </div>
          )
        ) : (
          requests.length === 0 ? (
            <div className="text-center py-12 glass-panel p-8">
              <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">inbox</span>
              <p className="text-white/60">Нет входящих запросов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request.id} className="glass-panel p-6">
                  <div className="mb-4">
                    <p className="text-white/80 text-sm">Запрос от пользователя</p>
                    <p className="text-white font-bold">{request.from}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 bg-accent text-white hover:bg-accent/80"
                    >
                      Принять
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(request.id)}
                      className="flex-1 bg-white/10 text-white hover:bg-white/20"
                    >
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </AppLayout>
  )
}

export default FriendsPage

