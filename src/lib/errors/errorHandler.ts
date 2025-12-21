import { mapFirebaseErrorToMessage } from '../firebase-errors'

export type ErrorType = 'firebase' | 'http' | 'network' | 'validation' | 'unknown'

export interface MappedError {
  type: ErrorType
  userMessage: string
  originalError: unknown
  code?: string
  timestamp: string
}

export function mapError(error: unknown, context?: string): MappedError {
  const timestamp = new Date().toISOString()

  if (!error) {
    return {
      type: 'unknown',
      userMessage: 'Произошла неизвестная ошибка',
      originalError: error,
      timestamp
    }
  }

  if (typeof error === 'object') {
    const err = error as { code?: string; message?: string; status?: number; statusCode?: number }

    if (err.code && err.code.startsWith('auth/')) {
      console.error(`[Error Handler - Firebase] ${context || 'Unknown context'}:`, {
        code: err.code,
        message: err.message,
        timestamp
      })

      return {
        type: 'firebase',
        userMessage: mapFirebaseErrorToMessage(error),
        originalError: error,
        code: err.code,
        timestamp
      }
    }

    if (err.status || err.statusCode) {
      const statusCode = err.status || err.statusCode
      console.error(`[Error Handler - HTTP] ${context || 'Unknown context'}:`, {
        status: statusCode,
        message: err.message,
        timestamp
      })

      let userMessage = 'Произошла ошибка при обращении к серверу'

      switch (statusCode) {
        case 400:
          userMessage = 'Некорректный запрос'
          break
        case 401:
          userMessage = 'Необходима авторизация'
          break
        case 403:
          userMessage = 'Доступ запрещён'
          break
        case 404:
          userMessage = 'Данные не найдены'
          break
        case 429:
          userMessage = 'Слишком много запросов. Попробуйте позже'
          break
        case 500:
        case 502:
        case 503:
          userMessage = 'Ошибка сервера. Попробуйте позже'
          break
      }

      return {
        type: 'http',
        userMessage,
        originalError: error,
        code: `HTTP_${statusCode}`,
        timestamp
      }
    }

    if (err.message && (err.message.includes('network') || err.message.includes('Failed to fetch'))) {
      console.error(`[Error Handler - Network] ${context || 'Unknown context'}:`, {
        message: err.message,
        timestamp
      })

      return {
        type: 'network',
        userMessage: 'Ошибка сети. Проверьте подключение к интернету',
        originalError: error,
        timestamp
      }
    }
  }

  console.error(`[Error Handler - Unknown] ${context || 'Unknown context'}:`, {
    error,
    timestamp
  })

  return {
    type: 'unknown',
    userMessage: typeof error === 'string' ? error : 'Произошла ошибка. Попробуйте позже',
    originalError: error,
    timestamp
  }
}

export function logError(error: MappedError, context?: string): void {
  const logData = {
    type: error.type,
    message: error.userMessage,
    code: error.code,
    timestamp: error.timestamp,
    context: context || 'Unknown',
    originalError: error.originalError
  }

  if (error.type === 'unknown' || error.type === 'http' && error.code?.includes('500')) {
    console.error('[Critical Error]', logData)
  } else {
    console.warn('[Error]', logData)
  }

  if (typeof globalThis.window !== 'undefined') {
    const win = globalThis.window as typeof globalThis.window & { Sentry?: { captureException: (error: unknown, options?: unknown) => void } }
    if (win.Sentry) {
      win.Sentry.captureException(error.originalError, {
        tags: {
          errorType: error.type,
          context: context || 'Unknown'
        },
        extra: {
          userMessage: error.userMessage,
          code: error.code
        }
      })
    }
  }
}

export function handleError(error: unknown, context?: string): string {
  const mapped = mapError(error, context)
  logError(mapped, context)
  return mapped.userMessage
}

