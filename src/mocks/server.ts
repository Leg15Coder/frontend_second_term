import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { createHandlers } from './handlers'

const handlers = createHandlers(rest)

export const server = setupServer(...handlers)
