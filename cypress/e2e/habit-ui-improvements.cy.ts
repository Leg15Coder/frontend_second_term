describe('Habit UI Improvements', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should display difficulty badge on habit card', () => {
    cy.visit('/habits')

    cy.get('button').contains(/добавить.*привычку|add.*habit/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()
    cy.get('input[placeholder*="например"]').first().type('Test Habit with Difficulty')

    cy.get('label').contains(/сложность|difficulty/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/высокая|hard/i).click()

    cy.get('button').contains(/создать|create/i).click()

    cy.contains('Test Habit with Difficulty')
      .parents('[class*="magic-card"]')
      .within(() => {
        cy.contains(/высокая|hard/i).should('exist')
        cy.get('[class*="text-red"]').should('exist')
      })
  })

  it('should support every_n_days frequency', () => {
    cy.visit('/habits')

    cy.get('button').contains(/добавить/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()
    cy.get('input[placeholder*="например"]').first().type('Every 3 Days Habit')

    cy.get('label').contains(/периодичность|frequency/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/каждые.*дн|every.*days/i).click()

    cy.get('label').contains(/каждые.*дн|every/i).should('exist')
    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').clear().type('3')

    cy.get('button').contains(/создать/i).click()

    cy.contains('Every 3 Days Habit')
      .parents('[class*="magic-card"]')
      .within(() => {
        cy.contains(/каждые 3/i).should('exist')
      })
  })

  it('should show everyNDays field only when every_n_days is selected', () => {
    cy.visit('/habits')
    cy.get('button').contains(/добавить/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()

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
    cy.get('button').contains(/добавить/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()

    cy.get('input[placeholder*="например"]').first().type('Test')
    cy.get('label').contains(/периодичность/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/каждые.*дн/i).click()

    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').clear().type('999')
    cy.get('button').contains(/создать/i).click()

    cy.url().should('include', '/habits')
  })

  it('should persist everyNDays value when editing habit', () => {
    cy.visit('/habits')

    cy.get('button').contains(/добавить/i).as('addHabitBtn').should('be.visible')
    cy.get('@addHabitBtn').click()
    cy.get('input[placeholder*="например"]').first().type('Edit Test')
    cy.get('label').contains(/периодичность/i).parent().find('[role="combobox"]').click()
    cy.get('[role="option"]').contains(/каждые.*дн/i).click()
    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').clear().type('5')
    cy.get('button').contains(/создать/i).click()

    cy.contains('Edit Test')
      .parents('[class*="magic-card"]')
      .within(() => {
        cy.get('button').contains(/изменить|edit/i).click()
      })

    cy.get('label').contains(/каждые/i).parent().find('input[type="number"]').should('have.value', '5')
  })

  it('should show all difficulty levels with correct colors', () => {
    cy.visit('/habits')

    const difficulties = [
      { name: 'Низкая', value: 'low', color: 'green' },
      { name: 'Средняя', value: 'medium', color: 'yellow' },
      { name: 'Высокая', value: 'hard', color: 'red' }
    ]

    cy.wrap(difficulties).each((diff) => {
      cy.get('button').contains(/добавить/i).as('addHabitBtn').should('be.visible')
      cy.get('@addHabitBtn').click()
      cy.get('input[placeholder*="например"]').first().type(`${diff.value} Habit`)

      cy.get('label').contains(/сложность/i).parent().find('[role="combobox"]')
        .click()
      cy.get('[role="option"]').contains(new RegExp(diff.name, 'i')).click()

      cy.get('button').contains(/создать/i).click()
      cy.wait(500)

      cy.contains(`${diff.value} Habit`)
        .parents('[class*="magic-card"]')
        .within(() => {
          cy.contains(new RegExp(diff.name, 'i')).should('exist')
          cy.get(`[class*="text-${diff.color}"]`).should('exist')
        })
    })
  })
})
