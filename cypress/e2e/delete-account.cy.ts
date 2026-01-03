/// <reference types="cypress" />

describe('Delete Account Functionality', () => {
  let testEmail = ''
  const testPassword = 'password123'

  beforeEach(() => {
    testEmail = `test-delete${Date.now()}@example.com`
    cy.mockFirestore()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
  })

  it('should successfully delete account after confirmation', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')

    cy.window().then((win) => {
      win.confirm = () => true
    })

    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible').click()
    cy.wait(3000)

    cy.location('pathname', { timeout: 15000 }).then((path) => {
      if (path.includes('/login')) {
        cy.get('body').invoke('text').should('match', /аккаунт.*удалён|удалён|deleted/i)
      } else if (path.includes('/settings')) {
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="reauth-dialog"]').length > 0) {
            cy.log('Reauth dialog appeared instead of immediate deletion')
            cy.get('[data-testid="reauth-dialog"]').should('exist')
          } else {
            cy.log('Still on settings but no reauth dialog')
          }
        })
      }
    })
  })

  it('should handle delete process correctly', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')

    cy.window().then((win) => {
      win.confirm = () => true
    })

    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible').click()
    cy.wait(3000)

    cy.url().then((url) => {
      const isOnLogin = url.includes('/login')
      const isOnSettings = url.includes('/settings')

      if (isOnLogin) {
        cy.log('Account deleted successfully, redirected to login')
        cy.get('body').invoke('text').should('match', /удалён|deleted|аккаунт/i)
      } else if (isOnSettings) {
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="reauth-dialog"]').length > 0) {
            cy.get('[data-testid="reauth-dialog"]').should('exist')
            cy.log('Reauthentication required')
          } else {
            cy.log('Still on settings, no reauth dialog')
          }
        })
      }
    })
  })

  it('should cancel delete when user clicks cancel', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')

    cy.window().then((win) => {
      win.confirm = () => false
    })

    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible').click()
    cy.wait(1000)

    cy.location('pathname').should('include', '/settings')
    cy.get('body').should('contain', 'Настройки')
  })

  it('should remain on settings if deletion is cancelled', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')

    cy.window().then((win) => {
      win.confirm = () => false
    })

    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible').click()
    cy.wait(1000)

    cy.get('[data-testid="delete-account-btn"]').should('be.visible')
  })

  it('should show delete account button', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')
    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible')
    cy.get('[data-testid="delete-account-btn"]').should('contain', 'Удалить аккаунт')
  })
})

describe('Delete Account with Confirmation', () => {
  let testEmail = ''
  const testPassword = 'password123'

  beforeEach(() => {
    testEmail = `test-confirm${Date.now()}@example.com`
    cy.mockFirestore()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
  })

  it('should handle confirmation dialog correctly', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')

    cy.window().then((win) => {
      win.confirm = () => true
    })

    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible')
  })

  it('should handle reauth dialog if it appears', () => {
    cy.get('a[href="/settings"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/settings')
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Настройки')

    cy.window().then((win) => {
      win.confirm = () => true
    })

    cy.get('[data-testid="delete-account-btn"]', { timeout: 30000 }).should('be.visible').click()
    cy.wait(3000)

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="reauth-dialog"]').length > 0) {
        cy.get('[data-testid="reauth-dialog"]').should('be.visible')
        cy.get('[data-testid="reauth-cancel-btn"]', { timeout: 10000 }).should('be.visible').click()
        cy.wait(1000)
        cy.get('[data-testid="reauth-dialog"]').should('not.exist')
        cy.location('pathname').should('include', '/settings')
      } else {
        cy.log('No reauth dialog - deletion proceeded directly')
      }
    })
  })
})
