import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PublicHero from './PublicHero'

describe('PublicHero', () => {
  it('renders title and subtitle', () => {
    const { getByText } = render(<PublicHero title="Hello" subtitle="World" />)
    expect(getByText('Hello')).toBeTruthy()
    expect(getByText('World')).toBeTruthy()
  })
})
