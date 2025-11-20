import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ChallengeCard from './ChallengeCard'

describe('ChallengeCard', () => {
  it('renders title and days', () => {
    render(<ChallengeCard title="Meditation" days="5 / 30 Days" description="Daily" />)
    expect(screen.getByText('Meditation')).toBeTruthy()
    expect(screen.getByText('Daily')).toBeTruthy()
    expect(screen.getByText(/5/)).toBeTruthy()
  })
})

