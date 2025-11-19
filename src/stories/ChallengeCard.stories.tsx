import type { Meta, StoryObj } from '@storybook/react'
import ChallengeCard from '../shared/public/ChallengeCard'

const meta: Meta<typeof ChallengeCard> = {
  title: 'Public/ChallengeCard',
  component: ChallengeCard,
}

export default meta

type Story = StoryObj<typeof ChallengeCard>

export const Default: Story = { args: { title: '30-Day Meditation', days: '12 / 30 Days', description: 'Daily sessions' } }
