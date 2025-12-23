import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from '@/app/store'
import Dashboard from '@/pages/Dashboard/Dashboard'
import HabitsPage from '@/pages/Habits/HabitsPage'
import GoalsPage from '@/pages/Goals/GoalsPage'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  )
}

describe('Smoke Tests - Pages render without crashing', () => {
  it('Dashboard should render', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getAllByText(/Главная/i)[0]).toBeInTheDocument()
  })

  it('HabitsPage should render', () => {
    renderWithProviders(<HabitsPage />)
    expect(screen.getAllByText(/Привычки/i)[0]).toBeInTheDocument()
  })

  it('GoalsPage should render', () => {
    renderWithProviders(<GoalsPage />)
    expect(screen.getAllByText(/Цели/i)[0]).toBeInTheDocument()
  })
})
