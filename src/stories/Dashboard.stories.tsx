import type { Meta, StoryObj } from '@storybook/react'
import PublicDashboard from '../pages/Public/Dashboard'

const meta: Meta<typeof PublicDashboard> = {
  title: 'Public/Dashboard',
  component: PublicDashboard,
}

export default meta

type Story = StoryObj<typeof PublicDashboard>

export const Default: Story = { args: {} }
