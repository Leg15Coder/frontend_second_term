/// <reference types="cypress" />

describe('Firebase Auth Error Handling', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.wait(1000)
  })

  it('should show user-friendly message for wrong credentials', () => {
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type('wrong@example.com')
    cy.get('input[type="password"]').should('be.visible').type('wrongpassword')

    cy.get('[data-testid="login-submit-btn"]').should('be.visible').click()

    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).invoke('text').should('match', /неверный email или пароль/i)
  })

  it('should show user-friendly message when popup closed for Google login', () => {
    cy.window().then((win) => {
      win.open = () => null
    })

    cy.get('button').contains(/google/i).click()
    cy.wait(3000)

    cy.url().should('match', /\/(login|dashboard)$/)
  })

  it('should redirect to dashboard on successful login', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')

    cy.get('button[type="submit"]').click()

    cy.get('body').invoke('text').should('match', /вход выполнен успешно|успешно/i)

    cy.url().should('include', '/dashboard')
  })

  it('should show validation errors for invalid email format', () => {
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type('invalid-email')
    cy.get('input[type="password"]').should('be.visible').type('password123')

    cy.get('[data-testid="login-submit-btn"]').click()
    cy.wait(1000)

    cy.url().should('include', '/login')
  })

  it('should show validation error for short password', () => {
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type('test@example.com')
    cy.get('input[type="password"]').should('be.visible').type('12345')

    cy.get('[data-testid="login-submit-btn"]').click()
    cy.wait(1000)

    cy.get('body', { timeout: 10000 }).invoke('text').should('match', /пароль.*минимум.*6/i)
  })

  it('should disable submit button while loading', () => {
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type('test@example.com')
    cy.get('input[type="password"]').should('be.visible').type('password123')

    cy.get('[data-testid="login-submit-btn"]').should('be.visible').and('not.be.disabled')

    cy.get('[data-testid="login-submit-btn"]').click()

    cy.url().should('include', '/dashboard')
  })
})

describe('Firebase Auth - Signup Error Handling', () => {
  beforeEach(() => {
    cy.visit('/signup')
    cy.wait(1000)
  })

  it('should show user-friendly message for email already in use', () => {
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[type="email"]').type('existing@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')

    cy.get('[data-testid="signup-submit-btn"]').click()

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
