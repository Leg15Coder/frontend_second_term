declare module 'msw' {
  import type { RequestHandler } from 'msw'
  export { rest } from 'msw'
  export function setupWorker(...handlers: RequestHandler[]): any
}

declare module 'msw/node' {
  import type { RequestHandler } from 'msw'
  export function setupServer(...handlers: RequestHandler[]): any
}

