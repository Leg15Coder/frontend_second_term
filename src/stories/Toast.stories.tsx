import type { Meta, StoryObj } from '@storybook/react'
import Toast from '../shared/ui/Toast'

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
}

export default meta

type Story = StoryObj<typeof Toast>

export const Success: Story = { args: { message: 'Saved', type: 'success' } }
export const ErrorState: Story = { args: { message: 'Failed', type: 'error' } }
