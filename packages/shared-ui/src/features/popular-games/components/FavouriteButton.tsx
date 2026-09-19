import { YStack } from 'tamagui'

import HeartFilled from '../../../assets/icon-heart-filled.svg'
import HeartOutline from '../../../assets/icon-heart.svg'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'
import { radius } from '../../../theme/tokens'
import type { GamesGeometry } from '../types'

interface FavouriteButtonProps {
  name: string
  isFavourite: boolean
  size: GamesGeometry
  onPress: () => void
}

// Authored — the design has no favourite control. The badge row's height is the hit area.
export function FavouriteButton({ name, isFavourite, size, onPress }: FavouriteButtonProps) {
  const Heart = isFavourite ? HeartFilled : HeartOutline

  return (
    <YStack
      width={size.badgeSize}
      height={size.badgeSize}
      borderRadius={radius.pill}
      alignItems="center"
      justifyContent="center"
      pressStyle={{ opacity: PRESS_OPACITY }}
      hoverStyle={{ opacity: PRESS_OPACITY }}
      {...pressable(onPress)}
      aria-pressed={isFavourite}
      aria-label={isFavourite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
    >
      <Heart width={size.favouriteGlyph} height={size.favouriteGlyph} />
    </YStack>
  )
}
