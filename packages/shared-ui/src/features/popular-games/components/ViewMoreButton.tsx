import { LinearGradient } from '@tamagui/linear-gradient'
import { Text } from 'tamagui'

import { aboveGradient } from '../../../lib/gradient'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'
import { fontWeight } from '../../../theme/fonts'
import { games, radius } from '../../../theme/tokens'

interface ViewMoreButtonProps {
  isLoading: boolean
  onPress: () => void
}

// btn HERO [violet] 56:841 — the header's Sign up veil at 228x46.
export function ViewMoreButton({ isLoading, onPress }: ViewMoreButtonProps) {
  return (
    <LinearGradient
      width={games.viewMoreWidth}
      height={games.viewMoreHeight}
      borderRadius={radius[1]}
      colors={['$signUpTop', '$signUpBottom']}
      start={[0, 0]}
      end={[0, 1]}
      alignItems="center"
      justifyContent="center"
      opacity={isLoading ? PRESS_OPACITY : 1}
      pressStyle={{ opacity: PRESS_OPACITY }}
      hoverStyle={{ opacity: PRESS_OPACITY }}
      {...pressable(onPress)}
      aria-busy={isLoading}
    >
      <Text
        {...aboveGradient}
        fontSize="$3"
        lineHeight="$3"
        fontWeight={fontWeight.semibold}
        textTransform="uppercase"
        color="$color"
      >
        {isLoading ? 'Loading' : 'View more games'}
      </Text>
    </LinearGradient>
  )
}
