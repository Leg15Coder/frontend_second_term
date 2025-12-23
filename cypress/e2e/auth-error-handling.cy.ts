/// <reference types="cypress" />

describe('Firebase Auth Error Handling', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should show user-friendly message for wrong credentials', () => {
    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpassword')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /неверный email или пароль/i)

    cy.get('body').should('not.contain', 'auth/user-not-found')
    cy.get('body').should('not.contain', 'auth/wrong-password')
    cy.get('body').should('not.contain', 'Firebase: Error')
  })

  it('should show user-friendly message when popup closed for Google login', () => {
    cy.window().then((win) => {
      // simulate popup blocked/closed by providing a no-op open
      win.open = () => null
    })

    cy.get('button').contains(/google/i).click()

    cy.get('body').invoke('text').should('match', /вход прерван пользователем|popup.*закрыт|заблокировано/i)

    cy.get('body').should('not.contain', 'auth/popup-closed-by-user')
  })

  it('should redirect to dashboard on successful login', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /вход выполнен успешно|успешно/i)

    cy.url().should('include', '/dashboard')
  })

  it('should show validation errors for invalid email format', () => {
    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /неверный.*email/i)
  })

  it('should show validation error for short password', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('12345')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /пароль.*минимум.*6/i)
  })

  it('should disable submit button while loading', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')

    cy.get('button[type="submit"]').as('submitBtn')
    cy.get('@submitBtn').click()

    cy.get('@submitBtn').should('be.disabled')
  })
})

describe('Firebase Auth - Signup Error Handling', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  it('should show user-friendly message for email already in use', () => {
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[type="email"]').type('existing@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /email.*используется|already.*use/i)

    cy.get('body').should('not.contain', 'auth/email-already-in-use')
  })

  it('should show validation error for password mismatch', () => {
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[type="email"]').type('newuser@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('different456')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /пароли не совпадают/i)
  })
})
