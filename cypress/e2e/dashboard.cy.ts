/// <reference types="cypress" />

describe('Dashboard basic flows', () => {
  it('loads dashboard and shows stats', () => {
    cy.createUser(`test-dashboard${Date.now()}@example.com`, 'password123')
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
    cy.get('[data-testid="dashboard-title"]', { timeout: 20000 }).should('be.visible')
    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="add-goal-btn"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="add-task-btn"]', { timeout: 10000 }).should('be.visible')
  })
})
