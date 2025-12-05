import type { Habit, Goal, User } from '../types'

type ReqWithBody<T = unknown> = { json: () => Promise<T>; params?: Record<string, string> }
type ResFn = (...args: unknown[]) => unknown
type CtxSubset = { status: (code: number) => unknown; json: (body: unknown) => unknown }

const habits: Habit[] = [
  {
    id: 'h1',
    title: 'Drink water',
    description: 'Drink 2L of water',
    completed: false,
    streak: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h2',
    title: 'Read',
    description: 'Read 30 pages',
    completed: true,
    streak: 5,
    createdAt: new Date().toISOString(),
  },
]

const goals: Goal[] = [
  {
    id: 'g1',
    title: 'Learn TypeScript',
    description: 'Complete a course',
    progress: 40,
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

const me: User = {
  id: 'u1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: undefined,
  createdAt: new Date().toISOString(),
}

export function createHandlers(rest: typeof import('msw').rest) {
  return [
    rest.get('/api/habits', (_req: ReqWithBody, res: ResFn, ctx: CtxSubset) => {
      return res(ctx.status(200), ctx.json(habits))
    }),

    rest.post('/api/habits', async (req: ReqWithBody<Partial<Habit>>, res: ResFn, ctx: CtxSubset) => {
      const body = await req.json()
      const newHabit: Habit = {
        id: `h${Math.random().toString(36).slice(2, 9)}`,
        title: body.title ?? 'Untitled',
        description: body.description,
        completed: false,
        streak: 0,
        createdAt: new Date().toISOString(),
      }
      habits.push(newHabit)
      return res(ctx.status(201), ctx.json(newHabit))
    }),

    rest.patch('/api/habits/:id/toggle', (req: ReqWithBody, res: ResFn, ctx: CtxSubset) => {
      const { id } = req.params as { id: string }
      const idx = habits.findIndex((h) => h.id === id)
      if (idx === -1) return res(ctx.status(404))
      habits[idx].completed = !habits[idx].completed
      return res(ctx.status(200), ctx.json(habits[idx]))
    }),

    rest.get('/api/goals', (_req: ReqWithBody, res: ResFn, ctx: CtxSubset) => {
      return res(ctx.status(200), ctx.json(goals))
    }),

    rest.post('/api/goals', async (req: ReqWithBody<Partial<Goal>>, res: ResFn, ctx: CtxSubset) => {
      const body = await req.json()
      const newGoal: Goal = {
        id: `g${Math.random().toString(36).slice(2, 9)}`,
        title: body.title ?? 'Untitled Goal',
        description: body.description,
        progress: body.progress ?? 0,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      goals.push(newGoal)
      return res(ctx.status(201), ctx.json(newGoal))
    }),

    rest.get('/api/me', (_req: ReqWithBody, res: ResFn, ctx: CtxSubset) => {
      return res(ctx.status(200), ctx.json(me))
    }),

    rest.patch('/api/me', async (req: ReqWithBody<Partial<User>>, res: ResFn, ctx: CtxSubset) => {
      const body = await req.json()
      const updated: User = { ...me, ...body }
      if (body.updatedAt === undefined) {
        ;(updated as unknown as Record<string, unknown>).updatedAt = new Date().toISOString()
      }
      return res(ctx.status(200), ctx.json(updated))
    }),
  ]
}
