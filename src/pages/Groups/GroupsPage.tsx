import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/Layout/AppLayout'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { fetchGroups, createGroup } from '../../features/groups/groupsSlice'
import { Button } from '../../components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { showErrorToast, showSuccessToast } from '../../lib/toast'

const GroupsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: groups, loading, error } = useAppSelector((s) => s.groups)
  const user = useAppSelector((s) => s.user.me)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    dispatch(fetchGroups())
  }, [dispatch])

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      showErrorToast('Введите название группы', { context: 'Create Group' })
      return
    }

    if (!user?.id) {
      showErrorToast('Необходима авторизация', { context: 'Create Group' })
      return
    }

    try {
      const result = await dispatch(createGroup({
        name: name.trim(),
        description: description.trim(),
        isPublic,
      })).unwrap()

      showSuccessToast('Группа создана!')
      setIsDialogOpen(false)
      setName('')
      setDescription('')
      setIsPublic(true)

      navigate(`/groups/${result.id}`)
    } catch (err) {
      showErrorToast(err, { context: 'Create Group' })
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Группы</p>
            <p className="text-white/60 text-base font-normal leading-normal">
              Создавайте группы и участвуйте в групповых челленджах
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-white hover:bg-accent/80">
                <span className="material-symbols-outlined text-sm mr-2">add</span>
                {' '}Создать группу
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Создать новую группу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="group-name" className="text-white/80 text-sm mb-2 block">Название</label>
                  <Input
                    id="group-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Например: Марафон здоровья"
                  />
                </div>
                <div>
                  <label htmlFor="group-description" className="text-white/80 text-sm mb-2 block">Описание</label>
                  <Textarea
                    id="group-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    placeholder="Краткое описание группы..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-white/80">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded"
                    />
                    <span>Публичная группа (видна всем)</span>
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateGroup} className="bg-primary text-white hover:bg-primary/90">
                  Создать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="glass-panel p-4 border-red-500/50 bg-red-500/10">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 glass-panel p-8">
            <span className="material-symbols-outlined text-6xl text-white/30 mb-4 block">groups</span>
            <p className="text-white/60">Нет групп. Создайте первую группу!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="glass-panel p-6 hover:border-primary/50 transition-all cursor-pointer"
                   onClick={() => navigate(`/groups/${group.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white text-xl font-bold">{group.name}</h3>
                  {!group.isPublic && (
                    <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">Приватная</span>
                  )}
                </div>
                {group.description && (
                  <p className="text-white/60 text-sm mb-3">{group.description}</p>
                )}
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <span className="material-symbols-outlined text-sm">group</span>
                  <span>{group.members?.length ?? 1} участников</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default GroupsPage

