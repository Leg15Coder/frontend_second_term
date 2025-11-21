/// <reference types="cypress" />

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
      } catch (e) {
        // if import fails, log to console in AUT
        // eslint-disable-next-line no-console
        console.error('Failed to start MSW worker from Cypress', e)
      }
    })()`)
  })
})

after(() => {
  cy.window().then((win) => {
    if ((win as any).__msw_worker__) {
      try {
        (win as any).__msw_worker__.stop()
      } catch (e) {
          console.log(e);
      }
    }
  })
})
