/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    mockAIServices(): Chainable<void>
    createUser(email: string, password: string): Chainable<void>
    initChallenges(): Chainable<void>
    mockFirestore(): Chainable<void>
  }
}

