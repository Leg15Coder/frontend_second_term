export const __e2e_support_module = true
;(globalThis as unknown as Record<string, unknown>).__e2e_support_module = __e2e_support_module

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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in programmatically
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Cypress.Chainable
    }
  }
}

const loginCommand = (email: string, password: string): Cypress.Chainable => {
  cy.visit('/login')
  cy.wait(1000)
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type(email)
  cy.get('input[type="password"]').should('be.visible').type(password)
  cy.get('[data-testid="login-submit-btn"]').should('be.visible').click()
  return cy.url().should('include', '/dashboard')
}

Cypress.Commands.add('login', loginCommand)

beforeEach(() => {
  const specName = Cypress.spec.name
  const authSpecs = [
    'auth-error-handling.cy.ts',
    '02-full-flow.cy.ts',
    'delete-account.cy.ts'
  ]

  if (!authSpecs.some(spec => specName.includes(spec))) {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    }
    localStorage.setItem('cypress_user', JSON.stringify(mockUser))
  }
})
