import type {Meta, StoryObj} from '@storybook/react'
import HeroSection from '../components/HeroSection'

const meta: Meta<typeof HeroSection> = {
  title: 'Landing/HeroSection',
  component: HeroSection,
}

export default meta

type Story = StoryObj<typeof HeroSection>

export const Default: Story = {}
