import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import app from '../firebase'

const isAnalyticsAvailable = async (): Promise<boolean> => {
  if (!app) return false
  try {
    return await isSupported()
  } catch {
    return false
  }
}

export const analytics = {
  trackEvent: async (name: string, params?: Record<string, unknown>) => {
    const supported = await isAnalyticsAvailable()
    if (!supported) return
    try {
      const a = getAnalytics(app)
      logEvent(a, name, params)
    } catch {
      return
    }
  },
}
