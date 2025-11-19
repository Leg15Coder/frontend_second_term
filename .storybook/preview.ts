import '../src/index.css'
import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'

type StoryFn = () => React.ReactElement | null

export const decorators: Array<(Story: StoryFn) => React.ReactElement | null> = [
  (Story) => React.createElement(BrowserRouter, null, Story()),
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
}

;(globalThis as unknown as Record<string, unknown>).__storybook_decorators = decorators
;(globalThis as unknown as Record<string, unknown>).__storybook_parameters = parameters
