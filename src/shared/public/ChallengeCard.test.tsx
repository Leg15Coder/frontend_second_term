import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ChallengeCard from './ChallengeCard'

describe('ChallengeCard', () => {
  it('renders title and days', () => {
    const { getByText } = render(<ChallengeCard title="Meditation" days="5 / 30 Days" description="Daily" />)
    expect(getByText('Meditation')).toBeTruthy()
    expect(getByText('Daily')).toBeTruthy()
    expect(getByText(/5/)).toBeTruthy()
  })
})
