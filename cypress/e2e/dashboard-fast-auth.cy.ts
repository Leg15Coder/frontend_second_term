/// <reference types="cypress" />

describe('Dashboard - Fast Auth Example', () => {
  beforeEach(() => {
    cy.createUser(`cypress-fast-${Date.now()}@test.com`, 'password123')
    cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard')
    cy.get('[data-testid="dashboard-title"]', { timeout: 30000 })
      .should('be.visible')
  })

  it('should display dashboard with user data', () => {
    cy.get('[data-testid="dashboard-title"]')
      .should('be.visible')
      .and('contain', 'Главная')
  })

  it('should navigate to habits page', () => {
    cy.get('[data-testid="add-habit-btn"]', { timeout: 15000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click()

    cy.url().should('include', '/habits')
  })

  it('should navigate to goals page', () => {
    cy.get('[data-testid="add-goal-btn"]', { timeout: 15000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click()

    cy.url().should('include', '/goals')
  })
})

