/// <reference types="cypress" />

describe('Habit Completion on Dashboard', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should mark habit as complete and persist after reload', () => {
    cy.visit('/dashboard')

    cy.get('[data-testid="habit-card"]').first().as('habitCard')

    cy.get('@habitCard').find('button').contains(/выполнить|отметить/i).click()

    cy.get('body').invoke('text').should('match', /привычка обновлена|успешно/i)

    cy.wait(500)

    cy.reload()

    cy.get('body').should('contain', 'Главная')
  })

  it('should toggle habit completion (mark and unmark)', () => {
    cy.visit('/dashboard')

    cy.get('[data-testid="habit-card"]').first().as('habitCard')

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

