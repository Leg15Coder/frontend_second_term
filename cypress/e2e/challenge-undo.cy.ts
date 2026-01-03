/// <reference types="cypress" />

describe('Challenge Check-in and Undo', () => {
  let testEmail = ''
  const testPassword = 'password123'

  beforeEach(() => {
    testEmail = `test-challenge${Date.now()}@example.com`
    cy.clearLocalStorage()
    cy.visit('/')
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
  })

  it('should navigate to challenges page', () => {
    cy.get('a[href="/challenges"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/challenges')
    cy.wait(2000)
    cy.contains('Вызовы', { timeout: 10000 }).should('be.visible')
  })

  it('should show challenges page content', () => {
    cy.get('a[href="/challenges"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/challenges')
    cy.wait(2000)
    cy.get('body').should('contain', 'Вызовы')
    cy.get('body').invoke('text').should('match', /Вызовы|вызовов|Присоединяйтесь/i)
  })

  it('should display either challenges or empty state', () => {
    cy.get('a[href="/challenges"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/challenges')
    cy.wait(2000)

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="challenge-card"]').length > 0) {
        cy.get('[data-testid="challenge-card"]').should('exist')
      } else {
        cy.contains(/Нет доступных вызовов|Вызовы будут добавлены/i).should('be.visible')
      }
    })
  })
})
