import { auth } from '../firebase'

export async function checkFirebaseConfig(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!auth.app.options.apiKey) {
      return { success: false, error: 'Firebase API Key отсутствует' }
    }

    if (!auth.app.options.authDomain) {
      return { success: false, error: 'Firebase Auth Domain отсутствует' }
    }

    if (!auth.app.options.projectId) {
      return { success: false, error: 'Firebase Project ID отсутствует' }
    }

    const authDomain = auth.app.options.authDomain as string
    if (!authDomain.includes('firebaseapp.com') && !authDomain.includes('web.app')) {
      console.warn('Auth Domain не выглядит как стандартный Firebase домен:', authDomain)
    }

    console.log('Firebase configuration check passed')
    return { success: true }
  } catch (error) {
    console.error('Firebase configuration check failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка конфигурации'
    }
  }
}

export function getFirebaseDebugInfo(): Record<string, string> {
  return {
    apiKey: auth.app.options.apiKey ? `${(auth.app.options.apiKey as string).substring(0, 10)}...` : 'missing',
    authDomain: (auth.app.options.authDomain as string) || 'missing',
    projectId: (auth.app.options.projectId as string) || 'missing',
    currentDomain: window.location.hostname,
    protocol: window.location.protocol
  }
}

