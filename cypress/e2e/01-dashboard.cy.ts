/// <reference types="cypress" />

describe('Dashboard basic flows', () => {
  it('loads dashboard and shows stats', () => {
    cy.visit('/')
    cy.contains('Habits').should('exist')
    cy.contains('Goals').should('exist')
  })
})
