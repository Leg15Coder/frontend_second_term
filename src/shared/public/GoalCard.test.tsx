import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GoalCard from './GoalCard'

describe('GoalCard', () => {
  it('renders title, description and sets progress width', () => {
    const { container } = render(<GoalCard title="Test Goal" progress={42} description="Desc" />)
    expect(container.querySelector('p')?.textContent).toContain('Test Goal')
    expect(container.querySelector('.text-sm')?.textContent).toContain('Desc')
    const progressInner = container.querySelector('.bg-primary') as HTMLElement | null
    expect(progressInner).toBeTruthy()
    expect(progressInner?.style.width).toBe('42%')
  })
})
