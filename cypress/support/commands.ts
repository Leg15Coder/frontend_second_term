/// <reference types="cypress" />

Cypress.Commands.add('createUser', (email: string, password: string) => {
  cy.visit('/signup')
  cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible').type('Test User')
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type(email)
  cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible').type(password)
  cy.get('input[name="confirmPassword"]', { timeout: 10000 }).should('be.visible').type(password)
  cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible').click()

  cy.contains('Аккаунт создан успешно', { timeout: 20000 }).should('be.visible')
  cy.location('pathname').should('include', '/dashboard')
  cy.contains('С возвращением', { timeout: 20000 }).should('be.visible')

  cy.visit('/profile')
  cy.location('pathname').should('include', '/profile')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.get('button', { timeout: 15000 }).then(($buttons: any) => {
    const els = Array.from($buttons)
    const btn = els.find((el) => /Выйти из аккаунта|Logout/i.test(((el as HTMLElement).textContent || '').trim())) as HTMLElement | undefined
    if (btn) {
      cy.wrap(btn).should('be.visible').click()
    } else {
      cy.get('[data-testid="logout"], [aria-label="logout"], .logout, .signout', { timeout: 5000 })
        .first()
        .should('be.visible')
        .click()
    }
  })

  cy.location('pathname').should('not.include', '/profile').and('not.include', '/dashboard')

  return cy.wrap(null)
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      createUser(email: string, password: string): Chainable
    }
  }
}

export {}
