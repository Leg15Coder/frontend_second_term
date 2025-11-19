if (import.meta.env.DEV) {
  const { worker } = await import('./browser')
  worker.start({ onUnhandledRequest: 'warn' })
}
