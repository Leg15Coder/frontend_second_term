if (import.meta.env.DEV) {
  const isCypress = typeof window !== 'undefined' && (window as any).Cypress
  if (!isCypress) {
    const { worker } = await import('./browser')
    worker.start({ onUnhandledRequest: 'warn' })
  }
}
