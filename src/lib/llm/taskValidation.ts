import type { GoalTask } from '@/types'

export interface GoalContext {
  goalText: string
  tags?: string[]
  deadline?: string | Date
  userHistorySummary?: string
  preferredDifficulty?: 'easy' | 'medium' | 'hard'
  relatedGoals?: string[]
}

export interface ValidatedTask extends GoalTask {
  priority?: 'low' | 'medium' | 'high'
  dependencies?: string[]
}

export function validateTaskStructure(task: unknown): task is GoalTask {
  if (!task || typeof task !== 'object') return false

  const t = task as Record<string, unknown>

  if (typeof t.title !== 'string' || t.title.trim().length === 0) return false
  if (t.title.length > 200) return false

  if (t.description !== undefined && typeof t.description !== 'string') return false
  if (typeof t.description === 'string' && t.description.length > 1000) return false

  if (t.week_estimate !== undefined && (typeof t.week_estimate !== 'number' || t.week_estimate < 0 || t.week_estimate > 52)) return false
  if (t.day_estimate !== undefined && (typeof t.day_estimate !== 'number' || t.day_estimate < 0 || t.day_estimate > 365)) return false

  return true
}

export function deduplicateTasks(tasks: GoalTask[]): GoalTask[] {
  const seen = new Set<string>()
  const unique: GoalTask[] = []

  for (const task of tasks) {
    const normalized = task.title.toLowerCase().trim().replace(/[^\w\s]/g, '')

    if (seen.has(normalized)) {
      continue
    }

    const similarityThreshold = 0.8
    let isDuplicate = false

    for (const existingNorm of seen) {
      if (calculateSimilarity(normalized, existingNorm) >= similarityThreshold) {
        isDuplicate = true
        break
      }
    }

    if (!isDuplicate) {
      seen.add(normalized)
      unique.push(task)
    }
  }

  return unique
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/))
  const words2 = new Set(str2.split(/\s+/))

  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])

  return union.size === 0 ? 0 : intersection.size / union.size
}

export function makeSMART(task: GoalTask): GoalTask {
  const improved = { ...task }

  if (!improved.description || improved.description.length < 10) {
    improved.description = `Выполнить: ${improved.title.toLowerCase()}`
  }

  if (!improved.acceptanceCriteria) {
    improved.acceptanceCriteria = `Задача считается выполненной, если: ${improved.title.toLowerCase()}`
  }

  if (!improved.week_estimate && !improved.day_estimate) {
    const titleWords = improved.title.split(/\s+/).length
    if (titleWords > 10) {
      improved.week_estimate = 2
    } else {
      improved.week_estimate = 1
    }
  }

  return improved
}

export function prioritizeTasks(tasks: GoalTask[], context?: GoalContext): ValidatedTask[] {
  const prioritized: ValidatedTask[] = tasks.map((task, index) => {
    let priority: 'low' | 'medium' | 'high' = 'medium'

    const title = task.title.toLowerCase()

    const urgentKeywords = ['срочно', 'сегодня', 'завтра', 'асап', 'важно', 'критично']
    const hasUrgent = urgentKeywords.some(kw => title.includes(kw))

    if (hasUrgent) {
      priority = 'high'
    } else if (index === 0) {
      priority = 'high'
    } else if (index < 3) {
      priority = 'medium'
    } else {
      priority = 'low'
    }

    if (context?.deadline) {
      const deadline = new Date(context.deadline)
      const now = new Date()
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilDeadline <= 7 && index < 5) {
        priority = 'high'
      }
    }

    return {
      ...task,
      priority
    }
  })

  return prioritized
}

export function filterInvalidTasks(tasks: GoalTask[]): GoalTask[] {
  return tasks.filter(task => {
    if (!validateTaskStructure(task)) return false

    const blacklistPatterns = [
      /^(task|задача|шаг)\s*\d+$/i,
      /^(todo|to do|сделать)$/i,
      /^\.{3,}/,
      /^placeholder/i
    ]

    if (blacklistPatterns.some(pattern => pattern.test(task.title))) {
      return false
    }

    if (task.title.length < 3) return false

    return true
  })
}

export function enhanceTasksWithContext(tasks: GoalTask[], context?: GoalContext): GoalTask[] {
  if (!context) return tasks

  return tasks.map(task => {
    const enhanced = { ...task }

    if (context.tags && context.tags.length > 0) {
      if (!enhanced.description) {
        enhanced.description = ''
      }
      enhanced.description = `${enhanced.description}\n\nСвязанные темы: ${context.tags.join(', ')}`
    }

    if (context.preferredDifficulty) {
      if (context.preferredDifficulty === 'easy') {
        if (enhanced.week_estimate && enhanced.week_estimate > 2) {
          enhanced.week_estimate = Math.ceil(enhanced.week_estimate * 0.7)
        }
      } else if (context.preferredDifficulty === 'hard') {
        if (enhanced.week_estimate && enhanced.week_estimate < 4) {
          enhanced.week_estimate = Math.ceil(enhanced.week_estimate * 1.5)
        }
      }
    }

    return enhanced
  })
}

export function postprocessTasks(tasks: GoalTask[], context?: GoalContext): ValidatedTask[] {
  let processed = filterInvalidTasks(tasks)

  processed = deduplicateTasks(processed)

  processed = processed.map(makeSMART)

  processed = enhanceTasksWithContext(processed, context)

  const prioritized = prioritizeTasks(processed, context)

  return prioritized
}

