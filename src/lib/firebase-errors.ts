export function mapFirebaseErrorToMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Произошла неизвестная ошибка'
  }

  const err = error as { code?: string; message?: string }

  console.error('[Firebase Auth Error]', {
    code: err.code,
    message: err.message,
    error
  })

  switch (err.code) {
    case 'auth/email-not-verified':
      return 'Email не подтвержден. Проверьте вашу почту и перейдите по ссылке из письма'

    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Неверный email или пароль'

    case 'auth/invalid-email':
      return 'Неверный формат email адреса'

    case 'auth/user-disabled':
      return 'Этот аккаунт был заблокирован'

    case 'auth/too-many-requests':
      return 'Слишком много попыток входа. Попробуйте позже'

    case 'auth/popup-closed-by-user':
      return 'Вход прерван пользователем'

    case 'auth/popup-blocked':
      return 'Всплывающее окно было заблокировано браузером'

    case 'auth/cancelled-popup-request':
      return 'Запрос на вход был отменён'

    case 'auth/unauthorized-domain':
      return 'Домен не авторизован для входа через Google'

    case 'auth/operation-not-allowed':
      return 'Метод входа не разрешён. Обратитесь к администратору'

    case 'auth/email-already-in-use':
      return 'Email уже используется другим аккаунтом'

    case 'auth/weak-password':
      return 'Пароль слишком слабый. Используйте минимум 6 символов'

    case 'auth/network-request-failed':
      return 'Ошибка сети. Проверьте подключение к интернету'

    case 'auth/expired-action-code':
      return 'Ссылка устарела'

    case 'auth/invalid-action-code':
      return 'Недействительная ссылка'

    default:
      return err.message || 'Произошла ошибка при входе. Попробуйте позже'
  }
}

export function validateOAuthConfig(): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (typeof globalThis.window === 'undefined') {
    return { isValid: true, errors: [] }
  }

  const currentOrigin = globalThis.window.location.origin
  console.log('[OAuth Config] Current origin:', currentOrigin)

  if (currentOrigin === 'http://localhost:5173' || currentOrigin.includes('localhost')) {
    console.warn('[OAuth Config] Running on localhost. Ensure Firebase console includes this origin in authorized domains.')
  }

  return { isValid: errors.length === 0, errors }
}

