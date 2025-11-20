import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PublicHero from './PublicHero'

describe('PublicHero', () => {
  it('renders title and subtitle', () => {
    render(<PublicHero title="Hello" subtitle="World" />)
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByText('World')).toBeTruthy()
  })
})

