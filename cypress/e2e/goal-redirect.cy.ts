describe('Goal Creation and Redirect', () => {
  const testEmail = `test-goal-redirect${Date.now()}@example.com`
  const testPassword = 'password123'

  beforeEach(() => {
    cy.mockAIServices()
    cy.mockFirestore()
    cy.clearLocalStorage()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
    cy.get('body').invoke('removeAttr', 'style')
  })

  it('should navigate to goals page successfully', () => {
    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('body').should('contain', 'Цели')
  })

  it('should show add goal button on goals page', () => {
    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('[data-testid="add-goal-btn"]', { timeout: 30000 }).should('be.visible')
  })
})

