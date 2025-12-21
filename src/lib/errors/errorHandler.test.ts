import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mapError, handleError, logError } from './errorHandler'

describe('errorHandler', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  describe('mapError', () => {
    it('should map Firebase auth errors', () => {
      const error = { code: 'auth/user-not-found', message: 'User not found' }
      const result = mapError(error, 'Login')

      expect(result.type).toBe('firebase')
      expect(result.userMessage).toBe('Неверный email или пароль')
      expect(result.code).toBe('auth/user-not-found')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should map HTTP 401 errors', () => {
      const error = { status: 401, message: 'Unauthorized' }
      const result = mapError(error, 'API Call')

      expect(result.type).toBe('http')
      expect(result.userMessage).toBe('Необходима авторизация')
      expect(result.code).toBe('HTTP_401')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should map HTTP 500 errors', () => {
      const error = { statusCode: 500, message: 'Internal Server Error' }
      const result = mapError(error)

      expect(result.type).toBe('http')
      expect(result.userMessage).toBe('Ошибка сервера. Попробуйте позже')
      expect(result.code).toBe('HTTP_500')
    })

    it('should map network errors', () => {
      const error = { message: 'Failed to fetch' }
      const result = mapError(error)

      expect(result.type).toBe('network')
      expect(result.userMessage).toBe('Ошибка сети. Проверьте подключение к интернету')
    })

    it('should handle unknown errors', () => {
      const error = new Error('Something went wrong')
      const result = mapError(error)

      expect(result.type).toBe('unknown')
      expect(result.userMessage).toBe('Произошла ошибка. Попробуйте позже')
    })

    it('should handle null error', () => {
      const result = mapError(null)

      expect(result.type).toBe('unknown')
      expect(result.userMessage).toBe('Произошла неизвестная ошибка')
    })

    it('should handle string error', () => {
      const result = mapError('Custom error message')

      expect(result.type).toBe('unknown')
      expect(result.userMessage).toBe('Custom error message')
    })
  })

  describe('handleError', () => {
    it('should return user-friendly message and log error', () => {
      const error = { code: 'auth/wrong-password' }
      const message = handleError(error, 'Authentication')

      expect(message).toBe('Неверный email или пароль')
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should log critical errors with console.error', () => {
      const error = { status: 500 }
      handleError(error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Critical Error]',
        expect.objectContaining({
          type: 'http',
          code: 'HTTP_500'
        })
      )
    })
  })

  describe('logError', () => {
    it('should use console.error for critical errors', () => {
      const mappedError = {
        type: 'http' as const,
        userMessage: 'Server error',
        originalError: { status: 500 },
        code: 'HTTP_500',
        timestamp: new Date().toISOString()
      }

      logError(mappedError, 'API')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Critical Error]',
        expect.objectContaining({
          type: 'http',
          code: 'HTTP_500'
        })
      )
    })

    it('should use console.warn for non-critical errors', () => {
      const mappedError = {
        type: 'validation' as const,
        userMessage: 'Invalid input',
        originalError: { message: 'Invalid' },
        timestamp: new Date().toISOString()
      }

      logError(mappedError, 'Form')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Error]',
        expect.objectContaining({
          type: 'validation'
        })
      )
    })
  })
})

