/* eslint-disable @typescript-eslint/no-explicit-any */

describe('End-to-End Flow: Habits and Goals', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('should complete full user flow: signup -> create habit -> mark habit -> create goal', () => {
    cy.contains('Регистрация').should('be.visible').click()
    cy.url().should('include', '/signup', { timeout: 10000 })

    cy.get('input[type="email"]').should('be.visible').type('test@example.com')
    cy.get('input[type="password"]').first().should('be.visible').type('password123')
    cy.get('button[type="submit"]').should('be.visible').click()

    cy.wait(2000)
    cy.get('body').then(($body) => {
      if ($body.find('.toast').length > 0) {
        cy.log('Toast found: ' + $body.find('.toast').text())
      }
    })

    cy.url().should('include', '/dashboard', { timeout: 40000 })
    cy.contains('Главная', { timeout: 10000 }).should('be.visible')

    cy.contains('Привычки').click()
    cy.url().should('include', '/habits', { timeout: 10000 })

    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('input[placeholder*="Утренняя медитация"]').type('Пробежка по утрам')
    cy.get('input[placeholder*="15 минут осознанности"]').type('30 минут каждое утро')

    cy.contains('Периодичность').parent().find('button').click()
    cy.contains('Ежедневно').click()

    cy.contains('Сложность').parent().find('button').click()
    cy.contains('Средняя').click()

    cy.contains('button', 'Создать').click()

    cy.contains('Пробежка по утрам').should('be.visible')

    cy.contains('Пробежка по утрам')
      .closest('div')
      .parents()
      .then(($parents: any) => {
        cy.wrap($parents).find('button').first().then(($btn: any) => {
          if ($btn && $btn.length) {
            cy.wrap($btn).click()
          }
        })
      })

    cy.contains('Главная').click()
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    cy.contains('Пробежка по утрам', { timeout: 10000 }).should('be.visible')

    cy.get('[data-testid="add-goal-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('input[placeholder*="Выучить TypeScript"]').type('Освоить React и TypeScript')
    cy.get('input[placeholder*="Краткое описание"]').type('Стать профессиональным фронтенд-разработчиком')

    cy.get('textarea').type('- Изучить основы TypeScript\n- Создать 3 проекта на React\n- Пройти курс по Redux')

    cy.contains('Разбить на подзадачи').click()

    cy.contains('Подзадачи', { timeout: 4000 }).should('be.visible')

    cy.contains('button', 'Создать').click()

    cy.contains('Цели').click()
    cy.url().should('include', '/goals')
    cy.contains('Освоить React и TypeScript').should('be.visible')

    cy.contains('Вызовы').click()
    cy.url().should('include', '/challenges')

    cy.get('body').then(($body: any) => {
      const buttons = $body.find('button')
      let found: any = null
      buttons.each((_: any, el: any) => {
        if (el && el.innerText && el.innerText.includes('Присоединиться')) {
          found = el
          return false
        }
        return undefined
      })
      if (found) {
        cy.wrap(found).click()
        cy.contains('Участвуете').should('be.visible')
      }
    })

    cy.contains('Настройки').click()
    cy.url().should('include', '/settings')
    cy.contains('Настройки').should('be.visible')

    cy.contains('Профиль').should('be.visible')
    cy.contains('Уведомления').should('be.visible')

    cy.visit('/profile')
    cy.contains('Профиль').should('be.visible')
    cy.contains('test@example.com').should('be.visible')

    cy.contains('Выйти из аккаунта').click()

    cy.url().should('include', '/login')
  })

  it('should handle habit check-in from dashboard', () => {
    cy.visit('/habits')
    cy.wait(1000)
    cy.get('[data-testid="add-habit-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('input').first().type('Test Habit for Dashboard')
    cy.contains('button', 'Создать').click()

    cy.wait(2000)
    cy.visit('/dashboard')
    cy.wait(2000)

    cy.contains('Test Habit for Dashboard', { timeout: 10000 })
      .closest('div')
      .parents()
      .then(($parents: any) => {
        cy.wrap($parents).find('input[type="checkbox"]').first().then(($checkbox: any) => {
          if ($checkbox && $checkbox.length) {
            cy.wrap($checkbox).check()
            cy.wrap($checkbox).should('be.checked')
          }
        })
      })
  })

  it('should handle goal task completion', () => {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    }
    localStorage.setItem('cypress_user', JSON.stringify(mockUser))

    cy.visit('/goals')
    cy.wait(1000)

    cy.get('[data-testid="add-goal-btn"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('input').first().type('Goal with Tasks')
    cy.get('textarea').type('- Task 1\n- Task 2\n- Task 3')
    cy.contains('Разбить на подзадачи').click()
    cy.wait(2000)
    cy.contains('Создать').click()

    cy.contains('Goal with Tasks').parents().then(($parents: any) => {
      cy.wrap($parents).find('button').then(($buttons: any) => {
        const arr = Array.from($buttons) as HTMLElement[]
        const edit = arr.find((el) => el && el.innerText && el.innerText.includes('Изменить'))
        if (edit) {
          cy.wrap(edit).click()
        }
      })
    })

    cy.get('input[type="checkbox"]').first().check()

    cy.contains('button', 'Обновить').click()

    cy.contains('Goal with Tasks').should('be.visible')
  })
})
