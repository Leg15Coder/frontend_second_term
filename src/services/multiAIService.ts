export type AIProvider = 'perplexity' | 'openai' | 'mock'

export interface AIConfig {
  provider: AIProvider
  enabled: boolean
  priority: number
}

export interface AIResponse {
  result: unknown
  provider: AIProvider
  cached?: boolean
}

const AI_PROVIDERS: AIConfig[] = [
  { provider: 'perplexity', enabled: true, priority: 1 },
  { provider: 'openai', enabled: true, priority: 2 },
  { provider: 'mock', enabled: true, priority: 999 }
]

async function callPerplexityAPI(prompt: string): Promise<unknown> {
  const res = await fetch('/.netlify/functions/perplexity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const text = await res.text()
  let parsed: unknown
  try { parsed = JSON.parse(text) } catch { parsed = null }
  if (parsed && typeof parsed === 'object') {
    const p = parsed as Record<string, unknown>
    if ('error' in p) throw new Error(String(p.error))
    if ('result' in p) return p.result
  }
  if (!res.ok) throw new Error(`Perplexity API error: ${res.status}`)
  return parsed
}

async function callOpenAIAPI(prompt: string): Promise<unknown> {
  const res = await fetch('/.netlify/functions/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const text = await res.text()
  let parsed: unknown
  try { parsed = JSON.parse(text) } catch { parsed = null }
  if (parsed && typeof parsed === 'object') {
    const p = parsed as Record<string, unknown>
    if ('error' in p) throw new Error(String(p.error))
    if ('result' in p) return p.result
  }
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`)
  return parsed
}

function getMockResponse(prompt: string): unknown {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes('привычки') || lowerPrompt.includes('habit')) {
    return {
      habits: [
        {
          title: 'Утренняя пробежка',
          description: 'Бегать каждое утро для поддержания формы',
          frequency: 'daily',
          difficulty: 'medium',
          confidence: 0.9,
          reasoning: 'Регулярная физическая активность поможет достичь цели'
        },
        {
          title: 'Здоровое питание',
          description: 'Следить за рационом и избегать вредной пищи',
          frequency: 'daily',
          difficulty: 'hard',
          confidence: 0.85,
          reasoning: 'Правильное питание критично для здоровья и энергии'
        }
      ]
    }
  }

  if (lowerPrompt.includes('задачи') || lowerPrompt.includes('task')) {
    return {
      tasks: [
        {
          title: 'Изучить основы',
          description: 'Ознакомиться с базовыми концепциями',
          week_estimate: 1,
          day_estimate: 7,
          acceptance_criteria: 'Понимание основных принципов'
        },
        {
          title: 'Практическое применение',
          description: 'Применить полученные знания на практике',
          week_estimate: 2,
          day_estimate: 14,
          acceptance_criteria: 'Выполнен тестовый проект'
        }
      ]
    }
  }

  return {
    message: 'Mock AI response',
    data: []
  }
}

export async function callMultiAI(prompt: string, options?: {
  preferredProvider?: AIProvider
  maxRetries?: number
}): Promise<AIResponse> {
  const maxRetries = options?.maxRetries ?? 3
  const preferredProvider = options?.preferredProvider

  const sortedProviders = [...AI_PROVIDERS]
    .filter(p => p.enabled)
    .sort((a, b) => {
      if (preferredProvider) {
        if (a.provider === preferredProvider) return -1
        if (b.provider === preferredProvider) return 1
      }
      return a.priority - b.priority
    })

  const errors: Array<{ provider: AIProvider; error: Error }> = []

  for (const config of sortedProviders) {
    if (errors.length >= maxRetries) break

    try {
      let result: unknown

      switch (config.provider) {
        case 'perplexity':
          result = await callPerplexityAPI(prompt)
          break
        case 'openai':
          result = await callOpenAIAPI(prompt)
          break
        case 'mock':
          result = getMockResponse(prompt)
          break
        default:
          throw new Error(`Unknown provider: ${config.provider}`)
      }

      return {
        result,
        provider: config.provider
      }
    } catch (error) {
      console.warn(`AI provider ${config.provider} failed:`, error)
      errors.push({
        provider: config.provider,
        error: error instanceof Error ? error : new Error(String(error))
      })
    }
  }

  const errorMessages = errors.map(e => `${e.provider}: ${e.error.message}`).join('; ')
  throw new Error(`All AI providers failed: ${errorMessages}`)
}

export function setProviderEnabled(provider: AIProvider, enabled: boolean): void {
  const config = AI_PROVIDERS.find(p => p.provider === provider)
  if (config) {
    config.enabled = enabled
  }
}

export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test' ||
         typeof globalThis.window !== 'undefined' && (globalThis.window as Window & { Cypress?: unknown }).Cypress !== undefined
}

