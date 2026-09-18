import { PAGE_SIZE, useGames, useToggleFavourite } from '@duxcasino/shared-api'
import type { Game, GameCategory } from '@duxcasino/shared-api'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { Text, XStack, YStack, useMedia } from 'tamagui'

import { Skeleton } from '../../../components/Skeleton'
import { pressable } from '../../../lib/pressable'
import { games } from '../../../theme/tokens'
import { tileWidth } from '../tileWidth'
import type { GamesGeometry } from '../types'
import { GameTile } from './GameTile'
import { GamesHeader } from './GamesHeader'
import { ViewMoreButton } from './ViewMoreButton'

interface PopularGamesProps {
  category: GameCategory
}

// The laptop frame (55:829) grids; the tablet (76:1412) and phone (98:5136) frames scroll one row
// per category. The brief wants one filtered grid, so the grid wins and each frame keeps its own
// columns, gaps, gutter and header.
export function PopularGames({ category }: PopularGamesProps) {
  const media = useMedia()
  const [contentWidth, setContentWidth] = useState(0)
  const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGames(category)
  const toggleFavourite = useToggleFavourite()

  const isLaptop = media.xl
  const size = isLaptop ? games.laptop : media.md ? games.tablet : games.phone

  const pages = data?.pages ?? []
  const loaded = pages.flatMap(page => page.games)
  const total = pages.at(-1)?.total ?? null

  const tileSize = tileWidth(contentWidth, size.columns, size.columnGap)

  // A 10-per-page fetch lands mid-row at 3 columns, so hold the tail back until View more fills it.
  const wholeRows = Math.floor(loaded.length / size.columns) * size.columns
  const visible = hasNextPage && wholeRows > 0 ? loaded.slice(0, wholeRows) : loaded

  function renderBody() {
    if (isError) {
      return (
        <YStack alignItems="center" gap="$3" paddingVertical="$9">
          <Text fontSize="$4" color="$colorMuted">
            Games are unavailable right now.
          </Text>
          <Text fontSize="$3" color="$accent" {...pressable(() => refetch())}>
            Try again
          </Text>
        </YStack>
      )
    }

    if (isPending || tileSize === 0) {
      return (
        <Grid size={size}>
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <Skeleton
              key={index}
              width={tileSize}
              height={tileSize}
              borderRadius={games.tileRadius}
              label="Loading games"
            />
          ))}
        </Grid>
      )
    }

    if (loaded.length === 0) {
      return (
        <YStack alignItems="center" gap="$3" paddingVertical="$9">
          <Text fontSize="$4" color="$colorMuted">
            No games in this category yet.
          </Text>
        </YStack>
      )
    }

    return (
      <>
        <Grid size={size}>
          {visible.map(game => (
            <GameTile
              key={game.id}
              game={game}
              tileSize={tileSize}
              size={size}
              onToggleFavourite={() => toggle(game)}
            />
          ))}
        </Grid>

        {hasNextPage ? (
          <YStack alignItems="center" paddingTop={size.viewMoreGap}>
            <ViewMoreButton
              isLoading={isFetchingNextPage}
              onPress={() => {
                if (!isFetchingNextPage) void fetchNextPage()
              }}
            />
          </YStack>
        ) : null}
      </>
    )
  }

  function toggle(game: Game) {
    toggleFavourite.mutate({ gameId: game.id, isFavourite: !game.isFavourite })
  }

  return (
    <YStack
      width="100%"
      maxWidth={games.frameWidth}
      alignSelf="center"
      paddingHorizontal={size.gutter}
      paddingTop={size.sectionPaddingTop}
      paddingBottom={size.sectionPaddingBottom}
      aria-label="Popular games"
    >
      <GamesHeader category={category} total={total} isLaptop={isLaptop} size={size} />

      {/* The mutation rolls the tile back silently; this is the only thing that says so. */}
      {toggleFavourite.isError ? (
        <Text fontSize="$3" color="$danger" paddingBottom="$3">
          Could not save your favourite — it has been put back.
        </Text>
      ) : null}

      <YStack
        width="100%"
        onLayout={(event: LayoutChangeEvent) => setContentWidth(event.nativeEvent.layout.width)}
      >
        {renderBody()}
      </YStack>
    </YStack>
  )
}

interface GridProps {
  size: GamesGeometry
  children: ReactNode
}

function Grid({ size, children }: GridProps) {
  return (
    <XStack flexWrap="wrap" columnGap={size.columnGap} rowGap={size.rowGap}>
      {children}
    </XStack>
  )
}
