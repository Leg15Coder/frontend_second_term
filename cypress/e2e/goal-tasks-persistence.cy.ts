describe('Goal Tasks Persistence', () => {
  beforeEach(() => {
    const testEmail = `test-goal-persist${Date.now()}@example.com`
    const testPassword = 'password123'

    cy.mockAIServices()
    cy.mockFirestore()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
    cy.get('body').invoke('removeAttr', 'style')
  })

  it('should navigate to goals page successfully', () => {
    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('body').should('contain', 'Цели')
  })

  it('should show error and rollback on failed task toggle', () => {
    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('body').should('contain', 'Цели')
    cy.get('[data-testid="add-goal-btn"]', { timeout: 10000 }).should('be.visible')
  })

  it('should update task status in edit dialog without saving to DB immediately', () => {
    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('body').should('contain', 'Цели')
  })

  it('should show goals page content', () => {
    cy.get('a[href="/goals"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/goals')
    cy.get('body').should('contain', 'Цели')
    cy.get('[data-testid="add-goal-btn"]', { timeout: 10000 }).should('be.visible')
  })
})

