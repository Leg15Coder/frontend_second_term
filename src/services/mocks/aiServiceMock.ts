import { vi } from 'vitest'
import type { AIResponse } from '../multiAIService'

export function mockAIService() {
  const mockHabitsResponse: AIResponse = {
    result: {
      habits: [
        {
          title: 'Утренняя зарядка',
          description: 'Делать зарядку каждое утро',
          frequency: 'daily',
          difficulty: 'low',
          confidence: 0.95,
          reasoning: 'Помогает проснуться и поддерживать тонус'
        },
        {
          title: 'Читать книги',
          description: 'Читать минимум 30 минут в день',
          frequency: 'daily',
          difficulty: 'medium',
          confidence: 0.9,
          reasoning: 'Развивает мышление и расширяет кругозор'
        }
      ]
    },
    provider: 'mock'
  }

  const mockTasksResponse: AIResponse = {
    result: {
      tasks: [
        {
          title: 'Подготовка материалов',
          description: 'Собрать все необходимые материалы для старта',
          week_estimate: 1,
          day_estimate: 5,
          acceptance_criteria: 'Все материалы собраны и проверены'
        },
        {
          title: 'Выполнение основной работы',
          description: 'Основная часть проекта',
          week_estimate: 3,
          day_estimate: 20,
          acceptance_criteria: 'Функционал реализован и протестирован'
        }
      ]
    },
    provider: 'mock'
  }

  return {
    callMultiAI: vi.fn().mockImplementation((prompt: string) => {
      const lowerPrompt = prompt.toLowerCase()

      if (lowerPrompt.includes('привычки') || lowerPrompt.includes('habit')) {
        return Promise.resolve(mockHabitsResponse)
      }

      if (lowerPrompt.includes('задачи') || lowerPrompt.includes('task')) {
        return Promise.resolve(mockTasksResponse)
      }

      return Promise.resolve({
        result: { message: 'Mock response' },
        provider: 'mock' as const
      })
    }),

    setProviderEnabled: vi.fn(),
    isTestEnvironment: vi.fn().mockReturnValue(true),

    mockHabitsResponse,
    mockTasksResponse
  }
}

export function setupAIMocks() {
  vi.mock('../multiAIService', () => mockAIService())
}

