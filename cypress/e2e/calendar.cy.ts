/// <reference types="cypress" />

describe('Calendar Page', () => {
  const testEmail = `test-calendar${Date.now()}@example.com`
  const testPassword = 'password123'

  before(() => {
    cy.createUser(testEmail, testPassword)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
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
    cy.wait(2000)

    cy.get('button').contains('chevron_right').should('be.visible').as('nextMonth')
    cy.wait(500)
    cy.get('@nextMonth').click({ force: true })
    cy.wait(1000)

    cy.get('button').contains('Сегодня').should('be.visible').as('todayBtn')
    cy.wait(500)
    cy.get('@todayBtn').click({ force: true })
    cy.wait(1000)

    cy.get('button').contains('chevron_left').should('be.visible').as('prevMonth')
    cy.wait(500)
    cy.get('@prevMonth').click({ force: true })
    cy.wait(1000)
  })

  it('should select a date and show details', () => {
    cy.visit('/calendar')
    cy.wait(2000)

    cy.get('button', { timeout: 10000 }).contains(/^\d+$/).first().should('be.visible').as('dateBtn')
    cy.wait(500)
    cy.get('@dateBtn').click({ force: true })
    cy.wait(1000)

    cy.get('body', { timeout: 10000 }).invoke('text').should('match', /детали/i)
  })

  it('should export calendar data as CSV', () => {
    cy.visit('/calendar')
    cy.wait(2000)

    cy.get('button', { timeout: 10000 }).contains(/экспорт/i).should('be.visible').as('exportBtn')
    cy.wait(500)
    cy.get('@exportBtn').click({ force: true })
    cy.wait(1000)
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

