import './commands'

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Cypress {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    interface Chainable {
      mockAIServices(): Chainable<void>
      createUser(email: string, password: string): Chainable<void>
      initChallenges(): Chainable<void>
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
  }
  /* eslint-enable @typescript-eslint/no-namespace */
}

Cypress.on('before:browser:launch', (browser, launchOptions) => {
  if (browser.name === 'electron') {
    launchOptions.preferences.defaultContentSetting = {
      ...launchOptions.preferences.defaultContentSetting,
      notifications: 'block'
    }
  }
  return launchOptions
})

