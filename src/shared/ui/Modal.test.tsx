import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  it('renders content when open', () => {
    const { getByText } = render(<Modal open={true} onClose={() => {}} title="T">Content</Modal>)
    expect(getByText('Content')).toBeTruthy()
    expect(getByText('T')).toBeTruthy()
  })
  it('renders children', () => {
    const { getByText } = render(<Modal open={true} onClose={() => {}} title="X"><div>Hi</div></Modal>)
    expect(getByText('Hi')).toBeTruthy()
  })
})
