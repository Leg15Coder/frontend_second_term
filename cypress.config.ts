import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      return config;
    },
    defaultCommandTimeout: 40000,
    requestTimeout: 40000,
    responseTimeout: 240000,
    pageLoadTimeout: 480000,
    supportFile: "cypress/support/e2e.ts",
  },
})
