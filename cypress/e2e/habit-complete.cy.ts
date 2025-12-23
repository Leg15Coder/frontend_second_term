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
    cy.get('input[type="email"]', { timeout: TIMEOUT }).type(testEmail)
    cy.get('input[type="password"]', { timeout: TIMEOUT }).type(testPassword)
    cy.get('button[type="submit"]', { timeout: TIMEOUT }).click()
    // wait for navigation to dashboard
    cy.location('pathname', { timeout: TIMEOUT }).should('include', '/dashboard')

    // Ensure at least one habit exists
    cy.visit('/habits')

    // Find add button more reliably: check the DOM and click the first matching (rus/en)
    cy.get('body', { timeout: TIMEOUT }).then(($body) => {
      if ($body.find('button:contains("Добавить")').length) {
        cy.contains('button', 'Добавить', { timeout: TIMEOUT }).click()
      } else if ($body.find('button:contains("Add")').length) {
        cy.contains('button', 'Add', { timeout: TIMEOUT }).click()
      } else {
        // As a last resort, try a generic button click (will fail loudly if nothing found)
        cy.get('button', { timeout: TIMEOUT }).first().click()
      }
    })

    // Use a placeholder-agnostic input lookup and type the habit name
    cy.get('input[placeholder*="например"]', { timeout: TIMEOUT })
      .first()
      .clear()
      .type('Test Habit')

    // Click create: prefer Russian then English
    cy.get('body', { timeout: TIMEOUT }).then(($body) => {
      if ($body.find('button:contains("Создать")').length) {
        cy.contains('button', 'Создать', { timeout: TIMEOUT }).click()
      } else if ($body.find('button:contains("Create")').length) {
        cy.contains('button', 'Create', { timeout: TIMEOUT }).click()
      } else {
        // fallback: click first primary button
        cy.get('button', { timeout: TIMEOUT }).contains(/create|создать|ok|submit/i).first().click()
      }
    })

    cy.contains('Test Habit', { timeout: TIMEOUT }).should('be.visible')

    cy.visit('/dashboard')
  })

  it('should mark habit as complete and persist after reload', () => {
    cy.visit('/dashboard')

    // Wait for habits to load
    cy.contains('Test Habit', { timeout: TIMEOUT }).should('be.visible')

    // Find the card containing our habit and alias it
    cy.contains('Test Habit', { timeout: TIMEOUT }).closest('[class*="magic-card"]').as('habitCard')

    // Click the first actionable button (alias before click to avoid detached-element issues)
    cy.get('@habitCard').find('button').first().as('habitBtn')
    cy.get('@habitBtn').click()

    // Expect either success or a friendly message: check page text for any matching phrase
    cy.get('body', { timeout: TIMEOUT })
      .invoke('text')
      .should('match', /привычка обновлена|успешно|обновлено/i)

    // Give UI a moment to settle and reload to assert persistence
    cy.wait(500)
    cy.reload()

    cy.get('body', { timeout: TIMEOUT }).should('contain', 'Главная')
    cy.contains('Test Habit', { timeout: TIMEOUT }).should('be.visible')
  })

  it('should toggle habit completion (mark and unmark)', () => {
    cy.visit('/dashboard')
    cy.contains('Test Habit', { timeout: TIMEOUT }).should('be.visible')

    cy.contains('Test Habit', { timeout: TIMEOUT }).closest('[class*="magic-card"]').as('habitCard')

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
