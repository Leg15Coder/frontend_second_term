// @ts-nocheck
/// <reference types="cypress" />

describe('Delete Account Functionality', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should successfully delete account after confirmation', () => {
    cy.visit('/settings')
    cy.url().should('include', '/settings')

    cy.get('button').contains(/удалить аккаунт|delete account/i).click()

    cy.get('body').invoke('text').should('match', /аккаунт.*удалён|account.*deleted/i)
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /неверный|not found|invalid/i)
  })

  it('should show reauthentication dialog if recent login required', () => {
    cy.visit('/settings')

    cy.intercept('DELETE', '**/users/**', {
      statusCode: 403,
      body: { code: 'auth/requires-recent-login', message: 'Requires recent login' }
    }).as('deleteAccount')

    cy.get('button').contains(/удалить аккаунт|delete account/i).click()

    cy.get('body').invoke('text').should('match', /подтверждение личности|повторный вход|reauthenticate/i)

    cy.get('input[type="password"]').last().type('password123')
    cy.get('button').contains(/подтвердить|confirm/i).click()

    cy.get('body').invoke('text').should('match', /успешн|success/i)
  })

  it('should cancel delete when user clicks cancel', () => {
    cy.visit('/settings')

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false)
    })

    cy.get('button').contains(/удалить аккаунт|delete account/i).click()

    cy.url().should('include', '/settings')

    cy.get('body').invoke('text').should('match', /профиль|settings|настройки/i)
  })

  it('should show error message when delete fails', () => {
    cy.visit('/settings')

    cy.intercept('DELETE', '**/users/**', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('deleteAccountError')

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true)
    })

    cy.get('button').contains(/удалить аккаунт|delete account/i).click()

    cy.get('body').invoke('text').should('match', /ошибка|error/i)

    cy.url().should('include', '/settings')
  })

  it('should delete all user data from Firestore', () => {
    cy.visit('/settings')

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true)
    })

    cy.get('button').contains(/удалить аккаунт|delete account/i).click()

    cy.wait(2000)

    cy.url().should('include', '/login')
  })
})

describe('Reauthentication Dialog', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.visit('/settings')
  })

  it('should close reauth dialog on cancel', () => {
    cy.intercept('DELETE', '**/users/**', {
      statusCode: 403,
      body: { code: 'auth/requires-recent-login' }
    })

    cy.get('button').contains(/удалить аккаунт/i).click()
    cy.get('body').invoke('text').should('match', /подтверждение личности/i)

    cy.get('button').contains(/отмена|cancel/i).click()

    cy.get('body').invoke('text').should('not.match', /подтверждение личности/i)
  })

  it('should show error for wrong password', () => {
    cy.intercept('DELETE', '**/users/**', {
      statusCode: 403,
      body: { code: 'auth/requires-recent-login' }
    })

    cy.get('button').contains(/удалить аккаунт/i).click()

    cy.get('input[type="password"]').last().type('wrongpassword')
    cy.get('button').contains(/подтвердить/i).click()

    cy.get('body').invoke('text').should('match', /неверн.*пароль|wrong password/i)
  })
})
