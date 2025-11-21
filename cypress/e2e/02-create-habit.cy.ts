/// <reference types="cypress" />

describe('Create habit flow (manual mock)', () => {
  it('can navigate to habits page', () => {
    cy.visit('/habits')
    cy.contains('Habits').should('exist')
  })
})
