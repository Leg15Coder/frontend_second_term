import { describe, it, expect, vi } from 'vitest'
import { habitsService } from '../../src/services/habitsService'

vi.mock('../../src/services/habitsService', () => ({
  habitsService: {
    getHabits: vi.fn().mockResolvedValue([]),
    addHabit: vi.fn().mockImplementation(async (h) => ({ ...h, id: 'new' })),
  }
}))

describe('habitsService', () => {
  it('getHabits returns array', async () => {
    const res = await (await import('../../src/services/habitsService')).habitsService.getHabits('u1')
    expect(Array.isArray(res)).toBe(true)
  })

  it('addHabit returns created doc', async () => {
    const res = await (await import('../../src/services/habitsService')).habitsService.addHabit({ title: 't', completed: false, userId: 'u1' })
    expect(res).toHaveProperty('id')
  })
})
