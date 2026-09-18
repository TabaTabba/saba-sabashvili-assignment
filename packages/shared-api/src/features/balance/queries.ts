import { useUserStore } from '@duxcasino/shared-stores'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { fetchBalance } from './mocks'

export const balanceKeys = {
  all: ['balance'] as const,
  byUser: (userId: string) => ['balance', userId] as const,
}

const THIRTY_SECONDS = 30_000

export function useUserBalance() {
  const user = useUserStore(state => state.user)
  const refreshToken = useUserStore(state => state.refreshToken)
  const userId = user?.id

  const query = useQuery({
    queryKey: balanceKeys.byUser(userId ?? 'anonymous'),
    // skipToken rather than `enabled`: refetch() ignores `enabled` and would fetch a balance for
    // an empty id while signed out.
    queryFn: userId ? () => fetchBalance(userId) : skipToken,
    staleTime: THIRTY_SECONDS,
  })

  const { refetch, isFetching, data, error } = query
  const lastToken = useRef(refreshToken)

  // refreshToken is watched rather than put in the queryKey: a new key per refresh would mint a
  // fresh cache entry and flash the loading state instead of refetching in the background. The ref
  // fires only on a real increment, so a sign-in with a stale token does not also refetch.
  useEffect(() => {
    if (refreshToken === lastToken.current) return
    lastToken.current = refreshToken
    if (userId) refetch()
  }, [refreshToken, userId, refetch])

  useEffect(() => {
    if (!userId) return
    const { setBalanceLoading, setBalanceSuccess, setBalanceError } = useUserStore.getState()

    if (isFetching) setBalanceLoading(userId)
    else if (error) setBalanceError(userId, error.message)
    else if (data) setBalanceSuccess(userId, data.amount)
  }, [userId, isFetching, data, error])

  return query
}
