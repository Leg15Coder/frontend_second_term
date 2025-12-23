describe('Goal Creation and Redirect', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })
    cy.visit('/')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should stay on goals page after creating a goal', () => {
    cy.visit('/goals')
    cy.url().should('include', '/goals')

    cy.get('button').contains(/add|создать|new/i).click()

    cy.get('input[aria-label*="title"], input[placeholder*="title"], input[name="title"]').type('Test Goal')
    cy.get('textarea[aria-label*="description"], textarea[placeholder*="description"], textarea[name="description"]').type('Test Description')

    cy.get('button').contains(/save|сохранить|create/i).click()

    cy.get('body').invoke('text').should('match', /цель добавлена|goal added|success/i)

    cy.url().should('include', '/goals')
    cy.url().should('not.include', '/habits')

    cy.contains('Test Goal')
  })

  it('should stay on goals page after editing a goal', () => {
    cy.visit('/goals')
    cy.get('button').contains(/add|создать|new/i).click()
    cy.get('input[aria-label*="title"], input[placeholder*="title"], input[name="title"]').type('Edit Test Goal')
    cy.get('button').contains(/save|сохранить|create/i).click()
    cy.get('body').invoke('text').should('match', /цель добавлена|goal added/i)

    cy.contains('Edit Test Goal').parents('[class*="card"], [class*="item"]').find('button[aria-label*="edit"], button[title*="edit"]').first().click()
    cy.get('input[aria-label*="title"], input[placeholder*="title"], input[name="title"]').clear().type('Updated Goal')
    cy.get('button').contains(/save|сохранить|update/i).click()

    cy.get('body').invoke('text').should('match', /цель обновлена|goal updated|success/i)

    cy.url().should('include', '/goals')
    cy.url().should('not.include', '/habits')
  })
})
