/// <reference types="cypress" />

Cypress.Commands.add('mockAIServices', () => {
  Cypress.Commands.overwrite('intercept', (originalFn, ...args) => {
    return originalFn(...args)
  })

  // @ts-expect-error - Cypress types issue with IDE
  cy.intercept('POST', '/.netlify/functions/perplexity', {
    statusCode: 200,
    body: {
      result: {
        habits: [
          {
            title: 'Утренняя пробежка',
            description: 'Бегать каждое утро для поддержания формы',
            frequency: 'daily',
            difficulty: 'medium',
            confidence: 0.9,
            reasoning: 'Регулярная физическая активность поможет достичь цели'
          },
          {
            title: 'Здоровое питание',
            description: 'Следить за рационом и избегать вредной пищи',
            frequency: 'daily',
            difficulty: 'hard',
            confidence: 0.85,
            reasoning: 'Правильное питание критично для здоровья и энергии'
          }
        ]
      }
    }
  })

  // @ts-expect-error - Cypress types issue with IDE
  cy.intercept('POST', '/.netlify/functions/claude', {
    statusCode: 200,
    body: {
      result: {
        habits: [
          {
            title: 'Утренняя пробежка',
            description: 'Бегать каждое утро для поддержания формы',
            frequency: 'daily',
            difficulty: 'medium',
            confidence: 0.9,
            reasoning: 'Регулярная физическая активность'
          }
        ]
      }
    }
  })

  // @ts-expect-error - Cypress types issue with IDE
  cy.intercept('POST', '/.netlify/functions/openai', {
    statusCode: 200,
    body: {
      result: {
        habits: [
          {
            title: 'Утренняя пробежка',
            description: 'Бегать каждое утро',
            frequency: 'daily',
            difficulty: 'medium',
            confidence: 0.9,
            reasoning: 'Физическая активность важна'
          }
        ]
      }
    }
  })
})

Cypress.Commands.add('createUser', (email: string, password: string) => {
  cy.visit('/signup')
  cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible').type('Test User')
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type(email)
  cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible').type(password)
  cy.get('input[name="confirmPassword"]', { timeout: 10000 }).should('be.visible').type(password)
  cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible').click()

  cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard')
  cy.get('[data-testid="dashboard-title"]', { timeout: 30000 }).should('be.visible')

  return cy.wrap(null)
})

Cypress.Commands.add('initChallenges', () => {
  return cy.window().then((win) => {
    const challenges = [
      {
        id: 'demo-30-day-challenge',
        title: '30-дневный вызов привычек',
        description: 'Создайте и поддерживайте ежедневные привычки в течение 30 дней',
        days: 30,
        startDate: new Date().toISOString(),
        participants: [],
        dailyChecks: {},
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-7-day-meditation',
        title: '7 дней медитации',
        description: 'Практикуйте медитацию каждый день в течение недели',
        days: 7,
        startDate: new Date().toISOString(),
        participants: [],
        dailyChecks: {},
        createdAt: new Date().toISOString(),
      }
    ]
    win.localStorage.setItem('motify_challenges', JSON.stringify(challenges))
    return cy.wrap(challenges)
  })
})

Cypress.Commands.add('mockFirestore', () => {
  cy.window().then((win) => {
    (win as any).Cypress = true;
    (win as any).__CYPRESS__ = true;
  })

  // @ts-expect-error - Cypress types issue with IDE
  cy.intercept('POST', '**/firestore.googleapis.com/**', {
    statusCode: 200,
    body: {
      writeResults: [{ updateTime: new Date().toISOString() }]
    }
  }).as('firestoreWrite')

  // @ts-expect-error - Cypress types issue with IDE
  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        kind: 'identitytoolkit#VerifyPasswordResponse',
        localId: 'test-user-id',
        email: req.body.email || 'test@example.com',
        displayName: 'Test User',
        idToken: 'mock-id-token',
        registered: true,
        refreshToken: 'mock-refresh-token',
        expiresIn: '3600'
      }
    })
  }).as('firebaseAuth')
})

