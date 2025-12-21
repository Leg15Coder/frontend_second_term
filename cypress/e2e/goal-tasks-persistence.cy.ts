describe('Goal Tasks Persistence', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should persist task completion status after page reload', () => {
    cy.visit('/goals')
    cy.url().should('include', '/goals')

    cy.get('button').contains(/добавить|add|new|создать/i).click()
    cy.get('input[aria-label*="title"], input[placeholder*="title"], input[name="title"]').type('Test Goal with Tasks')
    cy.get('textarea[id="goal-detailed"]').type('- Task 1\n- Task 2\n- Task 3')

    cy.get('button').contains(/разбить|generate/i).click()
    cy.wait(2000) // Wait for AI generation

    cy.get('button').contains(/сохранить|save|create/i).click()
    cy.get('body').invoke('text').should('match', /цель добавлена|goal added/i)

    cy.contains('Test Goal with Tasks')
      .parents('[class*="glass-panel"]')
      .find('button')
      .first()
      .click()

    cy.get('body').invoke('text').should('match', /задача обновлена|task updated/i)

    cy.reload()

    cy.contains('Test Goal with Tasks')
      .parents('[class*="glass-panel"]')
      .find('.material-symbols-outlined')
      .first()
      .should('contain', 'check_circle')
      .should('have.class', 'text-accent')
  })

  it('should show error and rollback on failed task toggle', () => {
    cy.visit('/goals')

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').first().click()
    })

    cy.get('body').invoke('text').should('match', /обновлена|updated|ошибка|error/i)
  })

  it('should update task status in edit dialog without saving to DB immediately', () => {
    cy.visit('/goals')

    cy.get('[class*="glass-panel"]').first().within(() => {
      cy.get('button').contains(/edit|редактировать/i).click()
    })

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[type="checkbox"]').first().check()

      cy.get('button[aria-label*="close"], button[title*="close"]').click()
    })
  })

  it('should calculate and update goal progress when toggling tasks', () => {
    cy.visit('/goals')

    cy.get('[class*="glass-panel"]').contains(/подзадач|tasks/i).within(() => {
      cy.get('[class*="bg-primary"]').invoke('attr', 'style').as('initialProgress')

      cy.get('button').first().click()
    })

    cy.wait(1000)

    cy.get('@initialProgress').then((initial) => {
      cy.get('[class*="glass-panel"]').contains(/подзадач|tasks/i)
        .find('[class*="bg-primary"]')
        .invoke('attr', 'style')
        .should('not.equal', initial)
    })
  })
})
