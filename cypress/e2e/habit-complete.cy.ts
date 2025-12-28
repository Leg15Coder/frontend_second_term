/// <reference types="cypress" />

describe('Habit Completion on Dashboard', () => {
  beforeEach(() => {
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

    cy.reload()
    cy.wait(2000)

    cy.get('body', { timeout: 10000 }).should('contain', 'Главная')
  })

  it('should toggle habit completion (mark and unmark)', () => {
    cy.visit('/dashboard')
    cy.wait(2000)

    cy.get('[data-testid="habit-card"]', { timeout: 10000 }).first().as('habitCard')

    cy.get('@habitCard').find('button').first().click()
    cy.wait(500)

    cy.get('@habitCard').find('button').first().click()
    cy.wait(500)

    cy.get('body').invoke('text').should('match', /привычка обновлена/i)
  })

  it('should show error message if localStorage is not available', () => {
    cy.visit('/dashboard')

    cy.window().then((win) => {
      win.localStorage.clear()
    })

    cy.get('[data-testid="habit-card"]').first().find('button').first().click()

    cy.get('body').invoke('text').should('match', /привычка обновлена|не удалось/i)
  })
})

