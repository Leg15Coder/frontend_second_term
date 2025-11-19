import type { Meta, StoryObj } from '@storybook/react'
import GoalCard from '../shared/public/GoalCard'

const meta: Meta<typeof GoalCard> = {
  title: 'Public/GoalCard',
  component: GoalCard,
}

export default meta

type Story = StoryObj<typeof GoalCard>

export const Default: Story = { args: { title: 'Run a Marathon', progress: 40, description: 'Build endurance' } }
