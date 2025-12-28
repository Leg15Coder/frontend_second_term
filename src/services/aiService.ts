import type { Habit, Goal } from '../types'
import { callMultiAI, isTestEnvironment, setProviderEnabled } from './multiAIService'

export interface HabitSuggestion {
  title: string
  description?: string
  frequency: 'daily' | 'weekdays' | 'custom' | 'every_n_days'
  customDays?: number[]
  everyNDays?: number
  difficulty?: 'low' | 'medium' | 'hard'
  confidence: number
  reasoning?: string
}

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function parseHabitSuggestions(raw: unknown, goalTitle: string): HabitSuggestion[] {
  if (!raw) return []

  let data: unknown
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch {
      return []
    }
  } else {
    data = raw
  }

  if (!data || typeof data !== 'object') return []

  const obj = data as Record<string, unknown>
  const suggestions: HabitSuggestion[] = []

  if (Array.isArray(obj.habits)) {
    for (const item of obj.habits) {
      if (item && typeof item === 'object') {
        const h = item as Record<string, unknown>
        if (typeof h.title === 'string' && h.title.length > 0) {
          suggestions.push({
            title: h.title,
            description: typeof h.description === 'string' ? h.description : undefined,
            frequency: (typeof h.frequency === 'string' && ['daily', 'weekdays', 'custom', 'every_n_days'].includes(h.frequency))
              ? h.frequency as 'daily' | 'weekdays' | 'custom' | 'every_n_days'
              : 'daily',
            difficulty: (typeof h.difficulty === 'string' && ['low', 'medium', 'hard'].includes(h.difficulty))
              ? h.difficulty as 'low' | 'medium' | 'hard'
              : 'medium',
            confidence: typeof h.confidence === 'number' ? h.confidence : 0.7,
            reasoning: typeof h.reasoning === 'string' ? h.reasoning : undefined
          })
        }
      }
    }
  }

  if (suggestions.length === 0 && goalTitle) {
    const defaultFreq = goalTitle.toLowerCase().includes('ежедневно') || goalTitle.toLowerCase().includes('каждый день') ? 'daily' : 'weekdays'
    suggestions.push({
      title: `Работать над целью: ${goalTitle}`,
      description: 'Регулярно выделяйте время для движения к цели',
      frequency: defaultFreq,
      difficulty: 'medium',
      confidence: 0.5
    })
  }

  return suggestions
}

export async function suggestHabitsForGoal(
  goal: Goal,
  existingHabits: Habit[] = []
): Promise<Habit[]> {
  const prompt = `Ты — ассистент по формированию привычек. Для указанной цели предложи 1-3 полезные привычки, которые помогут её достичь.

Цель: ${goal.title}
${goal.detailedDescription ? `Детали: ${goal.detailedDescription}` : ''}

${existingHabits.length > 0 ? `Существующие привычки пользователя: ${existingHabits.map(h => h.title).join(', ')}` : ''}

Требования:
1. Предложи привычки, которые реально помогут достичь цели
2. Учитывай существующие привычки, чтобы не дублировать
3. Для каждой привычки укажи:
   - title (краткое название)
   - description (зачем эта привычка)
   - frequency (daily, weekdays, every_n_days)
   - difficulty (low, medium, hard)
   - confidence (0-1, насколько уверен в полезности)
   - reasoning (краткое объяснение связи с целью)

Верни STRICT JSON формата:
{
  "habits": [
    {
      "title": "...",
      "description": "...",
      "frequency": "daily",
      "difficulty": "medium",
      "confidence": 0.8,
      "reasoning": "..."
    }
  ]
}

Если для цели не подходят привычки, верни пустой массив habits: []`

  try {
    if (isTestEnvironment()) {
      setProviderEnabled('perplexity', false)
      setProviderEnabled('openai', false)
      setProviderEnabled('mock', true)
    }

    const response = await callMultiAI(prompt, {
      maxRetries: 3
    })
    const suggestions = parseHabitSuggestions(response.result, goal.title)

    return suggestions.map(suggestion => ({
      id: createId(),
      title: suggestion.title,
      description: suggestion.description,
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(),
      frequency: suggestion.frequency,
      difficulty: suggestion.difficulty,
      status: 'suggested' as const,
      source: 'ai' as const,
      linkedGoalId: goal.id,
      confidence: suggestion.confidence,
      datesCompleted: []
    }))
  } catch (error) {
    console.error('Failed to suggest habits:', error)

    const defaultFreq = goal.title.toLowerCase().includes('ежедневно') ? 'daily' : 'weekdays'
    return [{
      id: createId(),
      title: `Работать над: ${goal.title.slice(0, 40)}`,
      description: 'Регулярно уделяйте время для достижения этой цели',
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(),
      frequency: defaultFreq,
      difficulty: 'medium',
      status: 'suggested',
      source: 'ai',
      linkedGoalId: goal.id,
      confidence: 0.5,
      datesCompleted: []
    }]
  }
}
