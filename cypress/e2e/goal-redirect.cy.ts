describe('Goal Creation and Redirect', () => {
  const testEmail = `test-goal-redirect${Date.now()}@example.com`
  const testPassword = 'password123'

  // RegExps typed as RegExp to match Cypress typings
  const addBtnRegex: RegExp = /add|создать|new/i
  const saveBtnRegex: RegExp = /сохранить|save|create/i
  const goalAddedRegex: RegExp = /цель добавлена|goal added|success/i
  const editBtnRegex: RegExp = /edit|редактировать/i
  const goalUpdatedRegex: RegExp = /цель обновлена|goal updated|success/i

  before(() => {
    cy.createUser(testEmail, testPassword)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
    cy.get('input[type="email"]', { timeout: 20000 }).should('be.visible').type(testEmail)
    cy.get('input[type="password"]', { timeout: 20000 }).should('be.visible').type(testPassword)
    // alias submit button and click to avoid detached-from-dom races
    cy.get('button[type="submit"]', { timeout: 20000 }).should('be.visible').as('submitBtn')
    cy.get('@submitBtn').click()
    // use location with timeout to wait for navigation
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
  })

  it('should stay on goals page after creating a goal', () => {
    cy.visit('/goals')
    cy.location('pathname', { timeout: 20000 }).should('include', '/goals')

    // find add button by scanning buttons' text and click (more stable)
    cy.get('button', { timeout: 20000 }).then($buttons => {
      const els = Array.from($buttons as unknown as HTMLElement[])
      const btn = els.find(b => addBtnRegex.test(b.innerText))
      if (!btn) throw new Error('Add button not found')
      cy.wrap(btn).as('addBtn')
    })
    cy.get('@addBtn').should('be.visible').click()

    // wait for form or modal to appear and operate inside it
    cy.get('form', { timeout: 20000 }).should('be.visible').within(() => {
      // use first input for title (more resilient than relying on placeholder text)
      cy.get('input').first().should('be.visible').type('Test Goal')
      // textarea for description
      cy.get('textarea').first().should('be.visible').type('Test Description')

      // find save/create button among buttons
      cy.get('button', { timeout: 20000 }).then($buttons => {
        const els = Array.from($buttons as unknown as HTMLElement[])
        const btn = els.find(b => saveBtnRegex.test(b.innerText))
        if (!btn) throw new Error('Save/Create button not found')
        cy.wrap(btn).as('saveBtn')
      })
      cy.get('@saveBtn').should('be.visible').click()
    })

    // verify success message appears (allow longer timeout)
    cy.get('body', { timeout: 20000 }).invoke('text').should('match', goalAddedRegex)

    cy.location('pathname', { timeout: 20000 }).should('include', '/goals')
    cy.location('pathname').should('not.include', '/habits')

    // assert created goal visible in the list
    cy.contains('Test Goal', { timeout: 20000 }).should('be.visible')
  })

  it('should stay on goals page after editing a goal', () => {
    cy.visit('/goals')
    cy.get('button', { timeout: 20000 }).then($buttons => {
      const els = Array.from($buttons as unknown as HTMLElement[])
      const btn = els.find(b => addBtnRegex.test(b.innerText))
      if (!btn) throw new Error('Add button not found')
      cy.wrap(btn).as('addBtn2')
    })
    cy.get('@addBtn2').should('be.visible').click()

    cy.get('form', { timeout: 20000 }).should('be.visible').within(() => {
      cy.get('input').first().should('be.visible').type('Edit Test Goal')
      cy.get('button', { timeout: 20000 }).then($buttons => {
        const els = Array.from($buttons as unknown as HTMLElement[])
        const btn = els.find(b => saveBtnRegex.test(b.innerText))
        if (!btn) throw new Error('Save button not found')
        cy.wrap(btn).as('saveBtn2')
      })
      cy.get('@saveBtn2').should('be.visible').click()
    })

    cy.get('body', { timeout: 20000 }).invoke('text').should('match', goalAddedRegex)

    // find the created goal, locate edit button in its panel and click (alias to avoid detaches)
    cy.contains('Edit Test Goal', { timeout: 20000 }).should('be.visible').parents('[class*="glass-panel"]', { timeout: 20000 }).first().as('goalPanel')
    cy.get('@goalPanel').find('button', { timeout: 20000 }).then($buttons => {
      const els = Array.from($buttons as unknown as HTMLElement[])
      const btn = els.find(b => editBtnRegex.test(b.innerText))
      if (!btn) throw new Error('Edit button not found in panel')
      cy.wrap(btn).as('editBtn')
    })
    cy.get('@editBtn').should('be.visible').click()

    // operate in edit form
    cy.get('form', { timeout: 20000 }).should('be.visible').within(() => {
      cy.get('input').first().clear().type('Updated Goal')
      cy.get('button', { timeout: 20000 }).then($buttons => {
        const els = Array.from($buttons as unknown as HTMLElement[])
        const btn = els.find(b => /сохранить|save|update/i.test(b.innerText))
        if (!btn) throw new Error('Update button not found')
        cy.wrap(btn).as('updateBtn')
      })
      cy.get('@updateBtn').should('be.visible').click()
    })

    cy.get('body', { timeout: 20000 }).invoke('text').should('match', goalUpdatedRegex)

    cy.location('pathname', { timeout: 20000 }).should('include', '/goals')
    cy.location('pathname').should('not.include', '/habits')

    cy.contains('Updated Goal', { timeout: 20000 }).should('be.visible')
  })
})
