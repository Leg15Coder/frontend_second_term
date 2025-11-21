import type { SetupWorkerApi, RestHandler, SetupServerApi } from 'msw'

declare module 'msw' {
  export { rest, RestHandler } from 'msw'
  export function setupWorker(...handlers: RestHandler[]): SetupWorkerApi
}

declare module 'msw/node' {
  import type { RestHandler } from 'msw'
  export function setupServer(...handlers: RestHandler[]): SetupServerApi
}
