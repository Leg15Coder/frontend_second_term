/// <reference types="cypress" />

describe('Habit Completion Simplified', () => {
  const TIMEOUT = 20000

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', TIMEOUT)
    Cypress.config('pageLoadTimeout', 60000)

    const testEmail = `test-habit-simple${Date.now()}@example.com`
    const testPassword = 'password123'

    cy.mockAIServices()
    cy.mockFirestore()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 40000 }).should('include', '/dashboard')
    cy.get('body').invoke('removeAttr', 'style')
  })

  it('should navigate to habits page and show add button', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 20000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[placeholder*="Утренняя медитация"]', { timeout: 10000 }).should('be.visible')
  })

  it('should show habits page elements', () => {
    cy.get('a[href="/habits"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('body').should('contain', 'Привычки')
    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible')
  })

  it('should open create habit dialog', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 20000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')
    cy.get('[role="dialog"]').within(() => {
      cy.contains('button', 'Создать').should('be.visible')
    })
  })
})

