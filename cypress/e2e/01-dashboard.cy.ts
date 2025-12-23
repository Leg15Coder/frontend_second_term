/// <reference types="cypress" />

describe('Dashboard basic flows', () => {
  it('loads dashboard and shows stats', () => {
    cy.visit('/dashboard')
    cy.contains(/Habits|Привычки/i).should('exist')
    cy.contains(/Goals|Цели/i).should('exist')
  })
})
