import { QueryClientProvider } from '@tanstack/react-query'
import type { InfiniteData, QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'

import { clearFaults, setFault } from '../../lib/faults'
import { createQueryClient } from '../../lib/queryClient'
import { resetGamesMock } from './mocks'
import { GAME_CATEGORIES } from './types'
import { gameKeys, useGames, useToggleFavourite } from './queries'
import type { GameCategory, GamesPage } from './types'

const SETTLE = { timeout: 5000 }

function makeWrapper() {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } })
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return { client, Wrapper }
}

function favouriteInCache(client: QueryClient, category: GameCategory, gameId: string) {
  const data = client.getQueryData<InfiniteData<GamesPage, number>>(gameKeys.byCategory(category))
  return data?.pages.flatMap(page => page.games).find(game => game.id === gameId)?.isFavourite
}

describe('useGames', () => {
  beforeEach(() => {
    clearFaults()
    resetGamesMock()
  })

  it('loads the first page of ten', async () => {
    const { result } = renderHook(() => useGames('all'), { wrapper: makeWrapper().Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)
    expect(result.current.data?.pages[0]?.games).toHaveLength(10)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('appends the next page rather than replacing it', async () => {
    const { result } = renderHook(() => useGames('all'), { wrapper: makeWrapper().Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)

    // Not wrapped in act(): awaiting fetchNextPage inside act leaves result.current on a stale
    // render even though the cache has both pages. Let waitFor drive the flush instead.
    void result.current.fetchNextPage()

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2), SETTLE)
    const ids = result.current.data?.pages.flatMap(page => page.games.map(game => game.id)) ?? []
    expect(ids).toHaveLength(20)
    expect(new Set(ids).size).toBe(20)
  })

  it.each(GAME_CATEGORIES.filter(category => category !== 'all'))(
    'paginates the %s category, so View more is reachable on every filter',
    async category => {
      const { result } = renderHook(() => useGames(category), { wrapper: makeWrapper().Wrapper })
      await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)

      expect(result.current.data?.pages[0]?.total).toBeGreaterThan(10)
      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.data?.pages[0]?.games.every(g => g.category === category)).toBe(true)
    },
  )

  it('stops paginating at the last page', async () => {
    const { result } = renderHook(() => useGames('jackpot'), { wrapper: makeWrapper().Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)

    void result.current.fetchNextPage()
    await waitFor(() => expect(result.current.hasNextPage).toBe(false), SETTLE)
  })

  it('exposes an error state when the fetch fails', async () => {
    setFault('games', true)
    const { result } = renderHook(() => useGames('all'), { wrapper: makeWrapper().Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true), SETTLE)
    expect(result.current.error?.message).toBe('Could not load games')
  })
})

describe('useToggleFavourite', () => {
  beforeEach(() => {
    clearFaults()
    resetGamesMock()
  })

  it('flips optimistically, then keeps the flip when the write succeeds', async () => {
    const { Wrapper } = makeWrapper()
    const games = renderHook(() => useGames('all'), { wrapper: Wrapper })
    await waitFor(() => expect(games.result.current.isSuccess).toBe(true), SETTLE)

    const toggle = renderHook(() => useToggleFavourite(), { wrapper: Wrapper })
    const target = games.result.current.data?.pages[0]?.games[0]?.id ?? ''

    toggle.result.current.mutate({ gameId: target, isFavourite: true })

    await waitFor(() =>
      expect(games.result.current.data?.pages[0]?.games[0]?.isFavourite).toBe(true),
    )
    expect(toggle.result.current.isPending).toBe(true)

    await waitFor(() => expect(toggle.result.current.isSuccess).toBe(true), SETTLE)
    expect(games.result.current.data?.pages[0]?.games[0]?.isFavourite).toBe(true)
  })

  it('flips optimistically, then rolls back when the write fails', async () => {
    const { Wrapper } = makeWrapper()
    const games = renderHook(() => useGames('all'), { wrapper: Wrapper })
    await waitFor(() => expect(games.result.current.isSuccess).toBe(true), SETTLE)

    const toggle = renderHook(() => useToggleFavourite(), { wrapper: Wrapper })
    const target = games.result.current.data?.pages[0]?.games[0]?.id ?? ''

    setFault('favourite', true)
    toggle.result.current.mutate({ gameId: target, isFavourite: true })

    // The optimistic flip must be observed, or this test also passes with onMutate deleted.
    await waitFor(() =>
      expect(games.result.current.data?.pages[0]?.games[0]?.isFavourite).toBe(true),
    )

    await waitFor(() => expect(toggle.result.current.isError).toBe(true), SETTLE)
    await waitFor(() =>
      expect(games.result.current.data?.pages[0]?.games[0]?.isFavourite).toBe(false),
    )
  })

  it('a failed toggle does not revert a different game that succeeded', async () => {
    const { Wrapper } = makeWrapper()
    const games = renderHook(() => useGames('all'), { wrapper: Wrapper })
    await waitFor(() => expect(games.result.current.isSuccess).toBe(true), SETTLE)

    const failing = renderHook(() => useToggleFavourite(), { wrapper: Wrapper })
    const succeeding = renderHook(() => useToggleFavourite(), { wrapper: Wrapper })

    const first = games.result.current.data?.pages[0]?.games[0]?.id ?? ''
    const second = games.result.current.data?.pages[0]?.games[1]?.id ?? ''

    setFault('favourite', true)
    failing.result.current.mutate({ gameId: first, isFavourite: true })
    await waitFor(() => expect(failing.result.current.isError).toBe(true), SETTLE)

    clearFaults()
    succeeding.result.current.mutate({ gameId: second, isFavourite: true })
    await waitFor(() => expect(succeeding.result.current.isSuccess).toBe(true), SETTLE)

    const page = games.result.current.data?.pages[0]?.games ?? []
    expect(page.find(game => game.id === first)?.isFavourite).toBe(false)
    expect(page.find(game => game.id === second)?.isFavourite).toBe(true)
  })

  it('patches every games cache, not just the one the caller is viewing', async () => {
    const { client, Wrapper } = makeWrapper()
    const all = renderHook(() => useGames('all'), { wrapper: Wrapper })
    const top = renderHook(() => useGames('top'), { wrapper: Wrapper })
    await waitFor(() => expect(all.result.current.isSuccess).toBe(true), SETTLE)
    await waitFor(() => expect(top.result.current.isSuccess).toBe(true), SETTLE)

    const toggle = renderHook(() => useToggleFavourite(), { wrapper: Wrapper })
    const target = top.result.current.data?.pages[0]?.games[0]?.id ?? ''

    expect(favouriteInCache(client, 'all', target)).toBe(false)

    toggle.result.current.mutate({ gameId: target, isFavourite: true })
    await waitFor(() => expect(toggle.result.current.isSuccess).toBe(true), SETTLE)

    // Asserted against the cache rather than a hook snapshot: the cache is what the next component
    // to read this game sees, and it is what the patch actually targets.
    expect(favouriteInCache(client, 'top', target)).toBe(true)
    expect(favouriteInCache(client, 'all', target)).toBe(true)
  })
})
