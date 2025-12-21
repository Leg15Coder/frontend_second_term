import React, { useState } from 'react'
import type { GoalTask } from '@/types'

interface NestedTaskListProps {
  tasks: GoalTask[]
  onToggle: (taskId: string) => void
}

const NestedTaskList: React.FC<NestedTaskListProps> = ({ tasks, onToggle }) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  const rootTasks = tasks.filter(t => !t.parentId)

  const getChildTasks = (parentId: string): GoalTask[] => {
    return tasks.filter(t => t.parentId === parentId)
  }

  const renderTask = (task: GoalTask, depth = 0): React.ReactElement => {
    const children = getChildTasks(task.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedTasks.has(task.id)
    const indentClass = depth > 0 ? `ml-${depth * 4}` : ''

    return (
      <div key={task.id} className={`${indentClass}`}>
        <label className="flex items-start gap-2 p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer mb-2">
          <div className="flex items-center gap-1 mt-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleExpand(task.id)
                }}
                className="text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">
                  {isExpanded ? 'expand_more' : 'chevron_right'}
                </span>
              </button>
            )}
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
              className="mt-0"
            />
          </div>
          <div className="flex-1">
            <p className={`text-white text-sm ${task.done ? 'line-through text-white/50' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-white/60 text-xs mt-1">{task.description}</p>
            )}
            {hasChildren && (
              <p className="text-white/40 text-xs mt-1">
                {children.filter(c => c.done).length} / {children.length} подзадач
              </p>
            )}
          </div>
        </label>

        {hasChildren && isExpanded && (
          <div className="ml-6 mt-1">
            {children.map(child => renderTask(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {rootTasks.map(task => renderTask(task))}
    </div>
  )
}

export default NestedTaskList

