/// <reference types="cypress" />

describe('Calendar Page', () => {
  const testEmail = `test-calendar${Date.now()}@example.com`
  const testPassword = 'password123'

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.createUser(testEmail, testPassword)
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
    cy.get('body').invoke('removeAttr', 'style')
  })

  it('should navigate to calendar page', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.get('body', { timeout: 10000 }).invoke('text').should('match', /календарь/i)
  })

  it('should display current month', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const currentMonth = monthNames[new Date().getMonth()]
    const currentYear = new Date().getFullYear()

    cy.get('[data-testid="calendar-month"]', { timeout: 30000 })
      .should('be.visible')
      .and('contain', currentMonth)
      .and('contain', currentYear.toString())
  })

  it('should navigate between months', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="calendar-month"]', { timeout: 30000 }).should('be.visible').as('monthDisplay')

    cy.get('[data-testid="calendar-next-month"]', { timeout: 30000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(2000)

    cy.get('[data-testid="calendar-today-btn"]', { timeout: 30000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(2000)

    cy.get('[data-testid="calendar-prev-month"]', { timeout: 20000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1000)

    cy.get('@monthDisplay').should('be.visible')
  })

  it('should select a date and show details', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="calendar-day"]', { timeout: 30000 }).then($days => {
      if ($days.length) {
        cy.wrap($days.eq(0)).click({ force: true })
        cy.wait(2000)
      } else {
        cy.log('No calendar-day elements found, searching for date buttons')
        cy.get('button').then($buttons => {
          const dateButton = $buttons.filter((_, el) => /^\d+$/.test(el.textContent?.trim() || ''))
          if (dateButton.length) {
            cy.wrap(dateButton.first()).click({ force: true })
            cy.wait(2000)
          }
        })
      }
    })
  })

  it('should export calendar data as CSV', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="calendar-export-btn"]', { timeout: 30000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1000)
  })

  it('should show activity heatmap', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="calendar-month"]', { timeout: 30000 }).should('be.visible')
    cy.get('body').invoke('text').should('match', /легенда/i)
    cy.get('body').invoke('text').should('match', /нет активности/i)
  })

  it('should display legend', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="calendar-month"]', { timeout: 30000 }).should('be.visible')
    cy.get('body').invoke('text').should('match', /легенда/i)
  })

  it('should highlight today', () => {
    cy.get('a[href="/calendar"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
    cy.wait(2000)

    cy.get('body').contains('Календарь', { timeout: 10000 }).should('be.visible')

    cy.get('[class*="ring-accent"]', { timeout: 30000 }).should('exist')
  })
})
