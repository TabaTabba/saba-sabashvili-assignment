import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { fetchGames, setGameFavourite } from './mocks'
import type { GameCategory, GamesPage } from './types'

export const PAGE_SIZE = 10

export const gameKeys = {
  all: ['games'] as const,
  byCategory: (category: GameCategory) => ['games', category] as const,
}

export function useGames(category: GameCategory) {
  return useInfiniteQuery({
    queryKey: gameKeys.byCategory(category),
    queryFn: ({ pageParam }) => fetchGames({ category, page: pageParam, pageSize: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: GamesPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    placeholderData: keepPreviousData,
  })
}

function patchFavourite(queryClient: QueryClient, gameId: string, isFavourite: boolean) {
  queryClient.setQueriesData<InfiniteData<GamesPage, number>>(
    { queryKey: gameKeys.all },
    current =>
      current && {
        ...current,
        pages: current.pages.map(page => ({
          ...page,
          games: page.games.map(game => (game.id === gameId ? { ...game, isFavourite } : game)),
        })),
      },
  )
}

interface FavouriteVariables {
  gameId: string
  isFavourite: boolean
}

export function useToggleFavourite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gameId, isFavourite }: FavouriteVariables) =>
      setGameFavourite(gameId, isFavourite),

    onMutate: async ({ gameId, isFavourite }: FavouriteVariables) => {
      await queryClient.cancelQueries({ queryKey: gameKeys.all })
      patchFavourite(queryClient, gameId, isFavourite)
    },

    onError: (_error, { gameId, isFavourite }: FavouriteVariables) => {
      patchFavourite(queryClient, gameId, !isFavourite)
    },
  })
}
