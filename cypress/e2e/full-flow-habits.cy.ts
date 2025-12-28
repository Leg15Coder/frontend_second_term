import '../support/commands'

describe('End-to-End Flow: Habits and Goals', () => {
  beforeEach(() => {
    cy.mockAIServices()
    cy.mockFirestore()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('should complete user signup and navigate to dashboard', () => {
    cy.createUser('test@example.com', 'password123')
    cy.location('pathname', { timeout: 10000 }).should('include', '/dashboard')
    cy.get('[data-testid="dashboard-title"]', { timeout: 10000 }).should('be.visible')
  })

  it('should navigate to habits page from dashboard', () => {
    cy.createUser('test2@example.com', 'password456')
    cy.location('pathname', { timeout: 10000 }).should('include', '/dashboard')
    cy.get('[data-testid="dashboard-title"]', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('include', '/habits')
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible')

    cy.get('input[placeholder*="Утренняя медитация"]', { timeout: 10000 }).should('be.visible')
  })

  it('should navigate to goals page from dashboard', () => {
    cy.createUser('test3@example.com', 'password789')
    cy.location('pathname', { timeout: 10000 }).should('include', '/dashboard')
    cy.get('[data-testid="dashboard-title"]', { timeout: 10000 }).should('be.visible')

    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('body').should('contain', 'Цели')
  })
})

