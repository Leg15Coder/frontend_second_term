import type { Meta, StoryObj } from '@storybook/react'
import PublicHero from '../shared/public/PublicHero'

const meta: Meta<typeof PublicHero> = {
  title: 'Public/PublicHero',
  component: PublicHero,
}

export default meta

type Story = StoryObj<typeof PublicHero>

export const Default: Story = { args: { title: 'Dashboard', subtitle: "Here's your progress for today." } }
