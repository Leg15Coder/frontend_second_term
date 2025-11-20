import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  it('renders content when open', () => {
    render(<Modal open={true} onClose={() => {}} title="T">Content</Modal>)
    expect(screen.getByText('Content')).toBeTruthy()
    expect(screen.getByText('T')).toBeTruthy()
  })
})

