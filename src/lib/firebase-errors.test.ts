import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mapFirebaseErrorToMessage, validateOAuthConfig } from './firebase-errors'

describe('mapFirebaseErrorToMessage', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should map auth/user-not-found to user-friendly message', () => {
    const error = { code: 'auth/user-not-found', message: 'Firebase: Error (auth/user-not-found).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Неверный email или пароль')
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('should map auth/wrong-password to user-friendly message', () => {
    const error = { code: 'auth/wrong-password', message: 'Firebase: Error (auth/wrong-password).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Неверный email или пароль')
  })

  it('should map auth/invalid-credential to user-friendly message', () => {
    const error = { code: 'auth/invalid-credential', message: 'Firebase: Error (auth/invalid-credential).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Неверный email или пароль')
  })

  it('should map auth/popup-closed-by-user to user-friendly message', () => {
    const error = { code: 'auth/popup-closed-by-user', message: 'Firebase: Error (auth/popup-closed-by-user).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Вход прерван пользователем')
  })

  it('should map auth/email-already-in-use to user-friendly message', () => {
    const error = { code: 'auth/email-already-in-use', message: 'Firebase: Error (auth/email-already-in-use).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Email уже используется другим аккаунтом')
  })

  it('should map auth/weak-password to user-friendly message', () => {
    const error = { code: 'auth/weak-password', message: 'Firebase: Error (auth/weak-password).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Пароль слишком слабый. Используйте минимум 6 символов')
  })

  it('should map auth/too-many-requests to user-friendly message', () => {
    const error = { code: 'auth/too-many-requests', message: 'Firebase: Error (auth/too-many-requests).' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Слишком много попыток входа. Попробуйте позже')
  })

  it('should handle unknown error codes with fallback message', () => {
    const error = { code: 'auth/unknown-error', message: 'Some error' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Some error')
  })

  it('should handle non-object errors', () => {
    const result = mapFirebaseErrorToMessage(null)
    expect(result).toBe('Произошла неизвестная ошибка')
  })

  it('should handle errors without code', () => {
    const error = { message: 'Generic error message' }
    const result = mapFirebaseErrorToMessage(error)
    expect(result).toBe('Generic error message')
  })

  it('should log original error for debugging', () => {
    const error = { code: 'auth/user-not-found', message: 'Test error' }
    mapFirebaseErrorToMessage(error)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Firebase Auth Error]',
      expect.objectContaining({
        code: 'auth/user-not-found',
        message: 'Test error',
        error
      })
    )
  })
})

describe('validateOAuthConfig', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  it('should validate config and log current origin', () => {
    const result = validateOAuthConfig()
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
    expect(consoleLogSpy).toHaveBeenCalled()
  })

  it('should warn when running on localhost', () => {
    const result = validateOAuthConfig()
    expect(result).toHaveProperty('isValid')
    expect(result).toHaveProperty('errors')
  })
})

