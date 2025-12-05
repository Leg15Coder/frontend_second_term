interface WindowWithCypress { Cypress?: unknown }

if (import.meta.env.DEV) {
  const isCypress = typeof window !== 'undefined' && Boolean((window as unknown as WindowWithCypress).Cypress)
  if (!isCypress) {
    const { worker } = await import('./browser')
    worker.start({ onUnhandledRequest: 'warn' })
  }
}
