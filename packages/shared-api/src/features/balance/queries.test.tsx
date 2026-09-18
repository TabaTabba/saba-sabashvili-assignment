import { useUserStore } from '@duxcasino/shared-stores'
import type { User } from '@duxcasino/shared-stores'
import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createQueryClient } from '../../lib/queryClient'
import { useUserBalance } from './queries'

const calls: string[] = []

vi.mock('./mocks', () => ({
  fetchBalance: async (userId: string) => {
    calls.push(userId)
    await new Promise(resolve => setTimeout(resolve, 20))
    return { userId, amount: 100 + calls.length, currency: 'EUR', updatedAt: '2026-01-01' }
  },
}))

const alice: User = {
  id: 'u_alice',
  username: 'alice',
  avatarUrl: 'https://example.test/a.png',
  currency: 'EUR',
}

const pristine = useUserStore.getState()
const SETTLE = { timeout: 5000 }

function makeWrapper() {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('useUserBalance', () => {
  beforeEach(() => {
    calls.length = 0
    useUserStore.setState(pristine, true)
  })

  it('does not fetch while signed out', async () => {
    const { result } = renderHook(() => useUserBalance(), { wrapper: makeWrapper() })

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(calls).toHaveLength(0)
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('does not fetch when a consumer calls refetch while signed out', async () => {
    const { result } = renderHook(() => useUserBalance(), { wrapper: makeWrapper() })

    await result.current.refetch()
    expect(calls).toHaveLength(0)
  })

  it('fetches once on sign in even when refreshToken is already non-zero', async () => {
    useUserStore.setState({ refreshToken: 5 })
    const { result } = renderHook(() => useUserBalance(), { wrapper: makeWrapper() })

    useUserStore.getState().signIn(alice)

    await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(calls).toEqual([alice.id])
  })

  it('refetches when refreshBalance bumps the token', async () => {
    useUserStore.getState().signIn(alice)
    const { result } = renderHook(() => useUserBalance(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)
    expect(calls).toHaveLength(1)

    useUserStore.getState().refreshBalance()
    await waitFor(() => expect(calls).toHaveLength(2), SETTLE)
  })

  it('mirrors a successful fetch into the store', async () => {
    useUserStore.getState().signIn(alice)
    const { result } = renderHook(() => useUserBalance(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true), SETTLE)
    await waitFor(() => expect(useUserStore.getState().balanceStatus).toBe('success'), SETTLE)
    expect(useUserStore.getState().balance).toBe(result.current.data?.amount)
  })
})
