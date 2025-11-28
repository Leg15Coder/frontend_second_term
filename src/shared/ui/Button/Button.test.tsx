import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders label', () => {
    const { getByText } = render(<Button>Click</Button>)
    expect(getByText('Click')).toBeTruthy()
  })
})
