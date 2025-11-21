import * as msw from 'msw'
import { createHandlers } from './handlers'

const { setupWorker } = msw

export const worker = setupWorker(...createHandlers(msw.rest))
