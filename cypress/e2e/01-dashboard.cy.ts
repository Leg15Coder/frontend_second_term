/// <reference types="cypress" />

describe('Dashboard basic flows', () => {
  it('loads dashboard and shows stats', () => {
    cy.visit('/dashboard')
    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).should('contain', 'Главная')
    cy.get('body').should('be.visible')
  })
})
