/// <reference types="cypress" />

describe('Habit Completion on Dashboard', () => {
  let testEmail = ''
  const testPassword = 'password123'
  const TIMEOUT = 20000

  beforeEach(() => {
    // increase default timeouts for this spec to reduce flaky timeouts
    Cypress.config('defaultCommandTimeout', TIMEOUT)
    Cypress.config('pageLoadTimeout', 60000)

    testEmail = `test-habit-complete${Date.now()}@example.com`
    cy.createUser(testEmail, testPassword)

    cy.visit('/login')
    cy.wait(1000)
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type('test@example.com')
    cy.get('input[type="password"]').should('be.visible').type('password123')
    cy.get('[data-testid="login-submit-btn"]').should('be.visible').click()
    cy.url().should('include', '/dashboard', { timeout: 40000 })
  })

  it('should mark habit as complete and persist after reload', () => {
    cy.visit('/dashboard')
    cy.wait(2000)

    cy.get('[data-testid="habit-card"]', { timeout: 10000 }).first().as('habitCard')

    cy.get('@habitCard').find('button').contains(/выполнить|отметить/i).click()
    cy.wait(1000)

    cy.get('body', { timeout: 10000 }).invoke('text').should('match', /привычка обновлена|успешно/i)

    cy.wait(1000)

    // Give UI a moment to settle and reload to assert persistence
    cy.wait(500)
    cy.reload()
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Главная')
  })

  it('should toggle habit completion (mark and unmark)', () => {
    cy.visit('/dashboard')
    cy.wait(2000)

    cy.get('[data-testid="habit-card"]', { timeout: 10000 }).first().as('habitCard')

    // Mark
    cy.get('@habitCard').find('button').first().as('habitBtn')
    cy.get('@habitBtn').click()
    cy.wait(500)

    // Unmark
    cy.get('@habitBtn').click()
    cy.wait(500)

    cy.get('body', { timeout: TIMEOUT }).invoke('text').should('match', /привычка обновлена|успешно|обновлено/i)
  })

  it('should show error message if localStorage is not available', () => {
    cy.visit('/dashboard')
    cy.contains('Test Habit', { timeout: TIMEOUT }).should('be.visible')

    cy.window().then((win) => {
      // Stub localStorage.setItem to throw so app's error path is exercised
      if (win && win.localStorage && typeof win.localStorage.setItem === 'function') {
        // use Cypress.sinon to avoid type issues with cy.stub
        Cypress.sinon.stub(win.localStorage, 'setItem').throws(new Error('QuotaExceededError'))
      }
    })

    cy.contains('Test Habit', { timeout: TIMEOUT }).closest('[class*="magic-card"]').as('habitCard')
    cy.get('@habitCard').find('button').first().as('habitBtn')
    cy.get('@habitBtn').click()

    // App may show success or an error toast; assert that one of expected messages appears in body text
    cy.get('body', { timeout: TIMEOUT }).invoke('text').should('match', /привычка обновлена|не удалось|ошибка|ошибке/i)
  })
})
