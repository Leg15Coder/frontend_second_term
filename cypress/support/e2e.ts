/// <reference types="cypress" />

interface WindowWithMSW {
  __msw_worker__?: { start?: (...args: unknown[]) => Promise<unknown>; stop?: () => void }
}

Cypress.on('uncaught:exception', (err) => {
  try {
    const msg = String(err?.message || err)
    if (msg.includes('auth/invalid-api-key') || msg.includes('Firebase: Error (auth/invalid-api-key)')) {
      return false
    }
  } catch (err) {
    // Log unexpected inspection errors to help CI debugging
    // eslint-disable-next-line no-console
    console.warn('Error while inspecting uncaught exception message', err)
  }
  return true
})

before(() => {
  cy.log('Cypress: initialize MSW worker from /src/mocks/browser.js')
  cy.window().then((win) => {
    return win.eval(`(async () => {
      try {
        const mod = await import('/src/mocks/browser.js')
        if (mod && mod.worker) {
          await mod.worker.start({ onUnhandledRequest: 'warn' })
          window.__msw_worker__ = mod.worker
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to start MSW worker from Cypress', String(err))
      }
    })()`)
  })
})

after(() => {
  cy.window().then((win) => {
    const w = win as unknown as WindowWithMSW
    if (w.__msw_worker__) {
      try {
        w.__msw_worker__.stop?.()
      } catch (err) {
        console.log(String(err))
      }
    }
  })
})

beforeEach(() => {
  const specName = Cypress.spec.name
  // List of specs that should start logged out or handle login themselves
  const authSpecs = [
    'auth-error-handling.cy.ts',
    '02-full-flow.cy.ts',
    'delete-account.cy.ts'
  ]

  if (!authSpecs.some(spec => specName.includes(spec))) {
    // Auto-login for other specs by setting the mock user in localStorage
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    }
    localStorage.setItem('cypress_user', JSON.stringify(mockUser))
  }
})
