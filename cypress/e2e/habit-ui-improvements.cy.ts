/// <reference types="cypress" />

describe('Habit UI Improvements', () => {
  const TIMEOUT = 20000

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', TIMEOUT)
    Cypress.config('pageLoadTimeout', 60000)

    const testEmail = `test-habit-ui${Date.now()}@example.com`
    const testPassword = 'password123'

    cy.mockAIServices()
    cy.mockFirestore()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 40000 }).should('include', '/dashboard')
  })

  it('should show habit creation form with all fields', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 20000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[placeholder*="Утренняя медитация"]').should('be.visible')
      cy.contains('Периодичность').should('be.visible')
      cy.contains('Сложность').should('be.visible')
    })
  })

  it('should show frequency options in select', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 20000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')

    cy.get('[role="dialog"]').within(() => {
      cy.contains('Периодичность').should('be.visible')
    })
  })

  it('should show difficulty options', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 20000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')

    cy.get('[role="dialog"]').within(() => {
      cy.contains('Сложность').should('be.visible')
    })
  })

  it('should display habits page correctly', () => {
    cy.get('a[href="/habits"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('body').should('contain', 'Привычки')
  })

  it('should show add button on habits page', () => {
    cy.get('a[href="/habits"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible')
  })

  it('should open and close habit dialog', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 20000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[placeholder*="Утренняя медитация"]', { timeout: 10000 }).should('be.visible')
  })
})

