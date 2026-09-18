import type { GameCategory } from '@duxcasino/shared-api'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Text, XStack, YStack } from 'tamagui'

import { CATEGORY_LABELS } from '../../../lib/categories'
import { aboveGradient } from '../../../lib/gradient'
import { fontWeight } from '../../../theme/fonts'
import { games, radius } from '../../../theme/tokens'
import type { GamesGeometry } from '../types'

interface GamesHeaderProps {
  category: GameCategory
  total: number | null
  isLaptop: boolean
  size: GamesGeometry
}

// The laptop frame (55:828) centres a heading; the smaller frames (80:1357, 98:5137) put the
// category left and a counter right. No category icons — the design has them for five of our seven.
export function GamesHeader({ category, total, isLaptop, size }: GamesHeaderProps) {
  const label = category === 'all' ? 'Popular Games' : CATEGORY_LABELS[category]

  const heading = (
    <Text
      fontSize={size.headerFont}
      lineHeight={size.headerFont}
      fontWeight={fontWeight[size.headerWeight]}
      textTransform="uppercase"
      color="$color"
      numberOfLines={1}
    >
      {label}
    </Text>
  )

  if (isLaptop) {
    return (
      <YStack
        height={size.headingHeight}
        paddingBottom={size.headingPaddingBottom}
        alignItems="center"
        justifyContent="center"
      >
        {heading}
      </YStack>
    )
  }

  return (
    <YStack paddingBottom={size.headerGap}>
      <XStack height={size.headerHeight} alignItems="center" justifyContent="space-between">
        {heading}
        {total === null ? null : <Counter total={total} size={size} />}
      </XStack>
    </YStack>
  )
}

interface CounterProps {
  total: number
  size: GamesGeometry
}

// btn COUNTER [bage] 77:1419; the phone variant 98:5144 drops the fill.
function Counter({ total, size }: CounterProps) {
  const above = size.counterHasGradient ? aboveGradient : {}

  const chip = (
    <>
      <Text {...above} fontSize="$3" lineHeight="$3" color="$color">
        Games
      </Text>
      <XStack
        {...above}
        height={games.counterChipHeight}
        paddingHorizontal={games.counterChipPaddingHorizontal}
        borderRadius={radius[1]}
        backgroundColor="$counterChip"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize={size.counterChipFont} lineHeight={size.counterChipFont} color="$color">
          {total}
        </Text>
      </XStack>
    </>
  )

  if (!size.counterHasGradient) {
    return (
      <XStack
        width={size.counterWidth}
        height={size.counterHeight}
        paddingHorizontal={games.counterPaddingHorizontal}
        alignItems="center"
        justifyContent="center"
        gap={games.counterGap}
      >
        {chip}
      </XStack>
    )
  }

  return (
    <LinearGradient
      width={size.counterWidth}
      height={size.counterHeight}
      borderRadius={games.tileRadius}
      paddingHorizontal={games.counterPaddingHorizontal}
      colors={['$counterTop', '$counterBottom']}
      start={[0, 0]}
      end={[0, 1]}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={games.counterGap}
    >
      {chip}
    </LinearGradient>
  )
}
