import type { Meta, StoryObj } from '@storybook/react'
import ProfileView from '../pages/Public/ProfileView'

const meta: Meta<typeof ProfileView> = {
  title: 'Public/ProfileView',
  component: ProfileView,
}

export default meta

type Story = StoryObj<typeof ProfileView>

export const Default: Story = { args: {} }
