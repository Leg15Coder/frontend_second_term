import type { Meta, StoryObj } from '@storybook/react'
import Modal from '../shared/ui/Modal'

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
}

export default meta

type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: { open: true, title: 'Confirm', children: <div>Are you sure?</div>, onClose: () => {} },
}
