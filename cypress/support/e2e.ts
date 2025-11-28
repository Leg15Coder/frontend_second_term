/// <reference types="cypress" />

interface WindowWithMSW {
  __msw_worker__?: { start?: (...args: unknown[]) => Promise<unknown>; stop?: () => void }
}

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
