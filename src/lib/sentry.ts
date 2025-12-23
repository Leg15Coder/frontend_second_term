import * as Sentry from '@sentry/browser'

export function initSentry(dsn?: string) {
  if (!dsn) return
  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION as string | undefined,
    })
  } catch (e) {}
}

export const captureException = (err: unknown) => {
  try {
    Sentry.captureException(err)
  } catch {}
}

