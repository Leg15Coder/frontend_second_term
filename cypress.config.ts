import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      return config;
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 120000,
    pageLoadTimeout: 160000,
    supportFile: "cypress/support/e2e.ts",
  },
})
