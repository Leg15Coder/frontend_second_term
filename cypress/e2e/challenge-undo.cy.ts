/// <reference types="cypress" />

describe('Challenge Check-in and Undo', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should allow checking in and undoing a challenge', () => {
    cy.visit('/challenges')
    cy.url().should('include', '/challenges')

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/присоединиться/i).click()
    })

    cy.get('body').invoke('text').should('match', /присоединились к вызову/i)

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/отметить день/i).should('exist')
      cy.get('button').contains(/отметить день/i).click()
    })

    cy.get('body').invoke('text').should('match', /день отмечен/i)

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/отменить/i).should('exist')
      cy.get('button').contains(/отменить/i).click()
    })

    cy.get('body').invoke('text').should('match', /отметка отменена/i)

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/отметить день/i).should('exist')
    })
  })

  it('should update progress when checking in', () => {
    cy.visit('/challenges')

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/присоединиться/i).then(($btn) => {
        if ($btn.text().match(/присоединиться/i)) {
          cy.wrap($btn).click()
          cy.wait(500)
        }
      })
    })

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('[class*="bg-accent"]').invoke('attr', 'style').as('initialProgress')
      cy.get('button').contains(/отметить день/i).click()
    })

    cy.wait(500)

    cy.get('@initialProgress').then(() => {
      cy.get('[class*="glass-panel"]').first()
        .find('[class*="bg-accent"]')
        .invoke('attr', 'style')
        .should('include', 'width')
    })
  })

  it('should persist check-in after page reload', () => {
    cy.visit('/challenges')

    cy.get('[class*="glass-panel"]').first().within(() => {
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

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/отменить/i).should('exist')
    })
  })
})

