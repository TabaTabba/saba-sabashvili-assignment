import { beforeEach, describe, expect, it } from 'vitest'

import { clearFaults, setFault } from '../../lib/faults'
import { fetchGames, resetGamesMock, setGameFavourite } from './mocks'
import { GAME_CATEGORIES } from './types'

describe('fetchGames', () => {
  beforeEach(() => {
    clearFaults()
    resetGamesMock()
  })

  it('returns 72 games — 12 per category, so every filter has a second page', async () => {
    const page = await fetchGames({ category: 'all', page: 0, pageSize: 200 })
    expect(page.total).toBe(72)
    expect(page.games).toHaveLength(72)
  })

  it('pages ten at a time and reports hasMore correctly', async () => {
    const first = await fetchGames({ category: 'all', page: 0, pageSize: 10 })
    expect(first.games).toHaveLength(10)
    expect(first.hasMore).toBe(true)

    const last = await fetchGames({ category: 'all', page: 7, pageSize: 10 })
    expect(last.games).toHaveLength(2)
    expect(last.hasMore).toBe(false)
  })

  it('returns a different slice per page', async () => {
    const first = await fetchGames({ category: 'all', page: 0, pageSize: 10 })
    const second = await fetchGames({ category: 'all', page: 1, pageSize: 10 })
    expect(first.games[0]?.id).not.toBe(second.games[0]?.id)
  })

  it('filters by category and every category has games', async () => {
    for (const category of GAME_CATEGORIES) {
      const page = await fetchGames({ category, page: 0, pageSize: 200 })
      expect(page.total, `category ${category}`).toBeGreaterThan(10)
      if (category !== 'all') {
        expect(page.games.every(game => game.category === category)).toBe(true)
      }
    }
  })

  it('takes 400-800ms so loading states are observable', async () => {
    const started = Date.now()
    await fetchGames({ category: 'all', page: 0, pageSize: 10 })
    const elapsed = Date.now() - started
    expect(elapsed).toBeGreaterThanOrEqual(390)
    expect(elapsed).toBeLessThan(1100)
  })

  it('surfaces an error when the games fault is set', async () => {
    setFault('games', true)
    await expect(fetchGames({ category: 'all', page: 0, pageSize: 10 })).rejects.toThrow(
      'Could not load games',
    )
  })
})

describe('setGameFavourite', () => {
  beforeEach(() => {
    clearFaults()
    resetGamesMock()
  })

  it('persists the favourite so a refetch keeps it', async () => {
    await setGameFavourite('game_1', true)
    const page = await fetchGames({ category: 'all', page: 0, pageSize: 10 })
    expect(page.games.find(game => game.id === 'game_1')?.isFavourite).toBe(true)
  })

  it('rejects when the favourite fault is set, so the UI can roll back', async () => {
    setFault('favourite', true)
    await expect(setGameFavourite('game_1', true)).rejects.toThrow('Could not save your favourite')
  })
})
