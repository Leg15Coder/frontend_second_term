describe('Habit UI Improvements', () => {
  let testEmail = ''
  const testPassword = 'password123'

  beforeEach(() => {
    testEmail = `test-habit-ui${Date.now()}@example.com`
    cy.createUser(testEmail, testPassword)

    cy.visit('/login')
    cy.wait(1000)
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type('test@example.com')
    cy.get('input[type="password"]').should('be.visible').type('password123')
    cy.get('[data-testid="login-submit-btn"]').should('be.visible').click()
    cy.url().should('include', '/dashboard', { timeout: 40000 })
  })

  it('should display difficulty badge on habit card', () => {
    cy.visit('/habits')
    cy.wait(2000)

    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.wait(1000)
    cy.get('input[placeholder*="например"]').first().should('be.visible').type('Test Habit with Difficulty')

    cy.get('label').contains(/сложность|difficulty/i).parent().find('[role="combobox"]').click()
    cy.wait(500)
    cy.get('[role="option"]').contains(/высокая|hard/i).click()

    cy.get('button').contains(/создать|create/i).click()
    cy.wait(2000)

    cy.contains('Test Habit with Difficulty', { timeout: 10000 })
      .parents('[class*="magic-card"]')
      .within(() => {
        cy.contains(/высокая|hard/i).should('exist')
        cy.get('[class*="text-red"]').should('exist')
      })
  })

  it('should support every_n_days frequency', () => {
    cy.visit('/habits')
    cy.wait(2000)

    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.wait(1000)
    cy.get('input[placeholder*="например"]').first().should('be.visible').type('Every 3 Days Habit')

    cy.get('label').contains(/периодичность|frequency/i).parent().find('[role="combobox"]').click()
    cy.wait(500)
    cy.get('[role="option"]').contains(/каждые.*дн|every.*days/i).click()

    cy.get('label').contains(/каждые.*дн|every/i).should('exist')
    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').clear().type('3')

    cy.get('button').contains(/создать|create/i).click()
    cy.wait(2000)

    cy.contains('Every 3 Days Habit', { timeout: 10000 })
      .parents('[class*="magic-card"]')
      .within(() => {
        cy.contains(/каждые 3/i).should('exist')
      })
  })

  it('should show everyNDays field only when every_n_days is selected', () => {
    cy.visit('/habits')
    cy.wait(2000)

    cy.get('button', { timeout: 10000 }).contains(/добавить|add/i).should('be.visible').click()
    cy.wait(1000)

    cy.get('label').contains(/каждые/i).should('not.exist')

    cy.get('label').contains(/периодичность/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/каждые.*дн/i).click()

    cy.get('label').contains(/каждые/i).should('exist')

    cy.get('label').contains(/периодичность/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/ежедневно|daily/i).click()

    cy.get('label').contains(/каждые/i).should('not.exist')
  })

  it('should validate everyNDays input range', () => {
    cy.visit('/habits')
    cy.get('button').contains(/добавить|add/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()

    cy.get('input[placeholder*="например"]').first().type('Test')
    cy.get('label').contains(/периодичность/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/каждые.*дн/i).click()

    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').clear().type('999')
    cy.get('button').contains(/создать|create/i).click()

    cy.url().should('include', '/habits')
  })

  it('should persist everyNDays value when editing habit', () => {
    cy.visit('/habits')

    cy.get('button').contains(/добавить|add/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()
    cy.get('input[placeholder*="например"]').first().type('Edit Test')
    cy.get('label').contains(/периодичность/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/каждые.*дн/i).click()
    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').clear().type('5')
    cy.contains('button', /создать/i).click({ force: true })

    cy.contains('Edit Test')
      .parents('[class*="magic-card"]')
      .within(() => {
        cy.get('button').contains(/изменить|edit/i).click({ force: true })
      })

    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').should('have.value', '5')
  })

  it('should show all difficulty levels with correct colors', () => {
    cy.visit('/habits')

    const difficulties: { name: string; value: string; color: string }[] = [
      { name: 'Низкая', value: 'low', color: 'green' },
      { name: 'Средняя', value: 'medium', color: 'yellow' },
      { name: 'Высокая', value: 'hard', color: 'red' }
    ]

    cy.wrap(difficulties).each((diff) => {
      const d = diff as { name: string; value: string; color: string }

      cy.get('button').contains(/добавить|add/i).as('addHabitBtn').should('be.visible')
      cy.get('@addHabitBtn').click()
      cy.get('input[placeholder*="например"]').first().type(`${d.value} Habit`)

      cy.get('label').contains(/сложность/i).parent().find('[role="combobox"]')
        .click()
      cy.get('[role="option"]').contains(new RegExp(d.name, 'i')).click()

      cy.get('button').contains(/создать|create/i).click()
      cy.wait(500)

      cy.contains(`${d.value} Habit`)
        .parents('[class*="magic-card"]')
        .within(() => {
          cy.contains(new RegExp(d.name, 'i')).should('exist')
          cy.get(`[class*="text-${d.color}"]`).should('exist')
        })
    })
  })
})
