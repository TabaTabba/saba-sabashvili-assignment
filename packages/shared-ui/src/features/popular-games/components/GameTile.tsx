import type { Game } from '@duxcasino/shared-api'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Text, XStack, YStack } from 'tamagui'

import Placeholder from '../../../assets/game-placeholder.svg'
import { aboveGradient } from '../../../lib/gradient'
import { fontWeight } from '../../../theme/fonts'
import { games, radius } from '../../../theme/tokens'
import { FOOTER_SCRIM_HEIGHT_RATIO } from '../constants'
import type { GamesGeometry } from '../types'
import { FavouriteButton } from './FavouriteButton'
import { TileBadges } from './TileBadges'

interface GameTileProps {
  game: Game
  tileSize: number
  size: GamesGeometry
  onToggleFavourite: () => void
}

// One shared placeholder means no artwork, so the name and line count the design keeps inside it
// are drawn in a scrim footer instead.
export function GameTile({ game, tileSize, size, onToggleFavourite }: GameTileProps) {
  const footerHeight = size.badgeSize * FOOTER_SCRIM_HEIGHT_RATIO

  return (
    <YStack
      width={tileSize}
      height={tileSize}
      borderRadius={games.tileRadius}
      overflow="hidden"
      backgroundColor="$surfaceRaised"
    >
      <Placeholder width={tileSize} height={tileSize} />

      <XStack
        position="absolute"
        top={size.badgeInset}
        left={size.badgeInset}
        right={size.badgeInset}
        gap={size.badgeGap}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <TileBadges badges={game.badges} size={size} />
        <FavouriteButton
          name={game.name}
          isFavourite={game.isFavourite}
          size={size}
          onPress={onToggleFavourite}
        />
      </XStack>

      <LinearGradient
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        height={footerHeight}
        paddingHorizontal={size.badgeInset}
        paddingBottom={size.badgeInset}
        colors={['$tileScrimStart', '$tileScrimEnd']}
        start={[0, 0]}
        end={[0, 1]}
        justifyContent="flex-end"
      >
        {/* Its own row: sharing one leaves the name four characters at the phone tile's 99px. */}
        <YStack {...aboveGradient} gap={size.badgeGap}>
          {game.badges.lines === null ? null : (
            <XStack
              alignSelf="flex-end"
              height={size.chipHeight}
              paddingHorizontal="$1"
              borderRadius={radius[1]}
              backgroundColor="$linesBadge"
              alignItems="center"
            >
              <Text
                fontSize={size.labelFont}
                lineHeight={size.labelFont}
                fontWeight={fontWeight.bold}
                textTransform="uppercase"
                color="$color"
                numberOfLines={1}
              >
                {game.badges.lines} lines
              </Text>
            </XStack>
          )}

          <Text
            fontSize={size.labelFont}
            lineHeight={size.labelFont}
            fontWeight={fontWeight.semibold}
            color="$color"
            numberOfLines={1}
          >
            {game.name}
          </Text>
        </YStack>
      </LinearGradient>
    </YStack>
  )
}
