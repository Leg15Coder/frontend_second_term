import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/Layout/AppLayout'
import { groupsService } from '@/services/groupsService'
import type { Group } from '@/types'
import { Button } from '../../components/ui/button'
import { showErrorToast } from '../../lib/toast'

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    groupsService.getGroupById(id).then(g => {
      setGroup(g)
      setLoading(false)
    }).catch(err => {
      showErrorToast(err, { context: 'Load Group' })
      setLoading(false)
    })
  }, [id])

  if (!id) return (
    <AppLayout>
      <div className="p-6">Неверный идентификатор группы</div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div className="p-6">
        <Button onClick={() => navigate('/groups')} className="mb-4">Вернуться к списку групп</Button>
        {loading && <div>Загрузка...</div>}
        {!loading && !group && <div>Группа не найдена</div>}
        {group && (
          <div className="glass-panel p-6">
            <h2 className="text-white text-2xl font-bold">{group.name}</h2>
            {group.description && <p className="text-white/60 mt-2">{group.description}</p>}
            <div className="mt-4 text-white/70">Участников: {group.members?.length ?? 0}</div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default GroupDetail

