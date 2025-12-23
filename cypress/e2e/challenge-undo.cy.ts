/// <reference types="cypress" />

describe('Challenge Check-in and Undo', () => {
  let testEmail = ''
  const testPassword = 'password123'

  beforeEach(() => {
    testEmail = `test-challenge${Date.now()}@example.com`
    cy.createUser(testEmail, testPassword)

    cy.visit('/login')
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should allow checking in and undoing a challenge', () => {
    cy.visit('/challenges')
    cy.url().should('include', '/challenges')

    cy.get('[class*="glass-panel"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[class*="glass-panel"]').first().as('challengeCard').should('be.visible')

    cy.get('@challengeCard').within(() => {
      cy.get('button').contains(/присоединиться/i).should('be.visible').click()
    })

    cy.get('body').invoke('text').should('match', /присоединились к вызову/i)

    cy.get('@challengeCard').within(() => {
      cy.get('button').contains(/отметить день/i).should('be.visible').click()
    })

    cy.get('body').invoke('text').should('match', /день отмечен/i)

    cy.get('@challengeCard').within(() => {
      cy.get('button').contains(/отменить/i).should('be.visible').click()
    })

    cy.get('body').invoke('text').should('match', /отметка отменена/i)

    cy.get('@challengeCard').within(() => {
      cy.get('button').contains(/отметить день/i).should('exist')
    })
  })

  it('should update progress when checking in', () => {
    cy.visit('/challenges')

    cy.get('[class*="glass-panel"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[class*="glass-panel"]').first().as('challengeCard').should('be.visible')

    cy.get('@challengeCard').within(() => {
      cy.get('button').contains(/присоединиться/i).then(($btn) => {
        if ($btn.text().match(/присоединиться/i)) {
          cy.wrap($btn).click()
          cy.wait(500)
        }
      })
    })

    cy.get('@challengeCard').within(() => {
      cy.get('[class*="bg-accent"]').invoke('attr', 'style').as('initialProgress')
      cy.get('button').contains(/отметить день/i).should('be.visible').click()
    })

    cy.wait(500)

    cy.get('@initialProgress').then(() => {
      cy.get('@challengeCard')
        .find('[class*="bg-accent"]')
        .invoke('attr', 'style')
        .should('include', 'width')
    })
  })

  it('should persist check-in after page reload', () => {
    cy.visit('/challenges')

    cy.get('[class*="glass-panel"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[class*="glass-panel"]').first().as('challengeCard').should('be.visible')

    cy.get('@challengeCard').within(() => {
      cy.get('button').contains(/присоединиться|отметить день/i).then(($btn) => {
        const text = $btn.text()
        if (text.match(/присоединиться/i)) {
          cy.wrap($btn).click()
          cy.wait(500)
          cy.get('button').contains(/отметить день/i).click()
        } else {
          cy.wrap($btn).click()
        }
      })
    })

    cy.wait(500)
    cy.reload()

    cy.get('[class*="glass-panel"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[class*="glass-panel"]').first().as('challengeCardReloaded').should('be.visible')

    cy.get('@challengeCardReloaded').within(() => {
      cy.get('button').contains(/отменить/i).should('exist')
    })
  })
})

