import type { Meta, StoryObj } from '@storybook/react'
import Habits from '../pages/Public/Habits'

const meta: Meta<typeof Habits> = {
  title: 'Public/Habits',
  component: Habits,
}

export default meta

type Story = StoryObj<typeof Habits>

export const Default: Story = { args: {} }
