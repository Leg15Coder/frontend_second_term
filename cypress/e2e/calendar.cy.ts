/// <reference types="cypress" />

describe('Calendar Page', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should navigate to calendar page', () => {
    cy.get('a[href="/calendar"]').click()
    cy.url().should('include', '/calendar')
    cy.get('body').invoke('text').should('match', /календарь/i)
  })

  it('should display current month', () => {
    cy.visit('/calendar')

    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const currentMonth = monthNames[new Date().getMonth()]
    const currentYear = new Date().getFullYear()

    cy.get('body').invoke('text').should('include', currentMonth)
    cy.get('body').invoke('text').should('include', currentYear.toString())
  })

  it('should navigate between months', () => {
    cy.visit('/calendar')

    cy.get('button').contains('chevron_right').click()
    cy.wait(500)

    cy.get('button').contains('Сегодня').click()
    cy.wait(500)

    cy.get('button').contains('chevron_left').click()
    cy.wait(500)
  })

  it('should select a date and show details', () => {
    cy.visit('/calendar')

    cy.get('button').contains(/^\d+$/).first().click()

    cy.get('body').invoke('text').should('match', /детали/i)
  })

  it('should export calendar data as CSV', () => {
    cy.visit('/calendar')

    cy.get('button').contains(/экспорт/i).click()
  })

  it('should show activity heatmap', () => {
    cy.visit('/calendar')

    cy.get('[class*="bg-green"]').should('exist')
  })

  it('should display legend', () => {
    cy.visit('/calendar')

    cy.get('body').invoke('text').should('match', /легенда/i)
    cy.get('body').invoke('text').should('match', /нет активности/i)
  })

  it('should highlight today', () => {
    cy.visit('/calendar')

    cy.get('[class*="ring-accent"]').should('exist')
  })
})

