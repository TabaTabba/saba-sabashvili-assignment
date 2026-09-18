import { YStack } from 'tamagui'

import SwipeCircle from '../../../assets/swipe-button.svg'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'
import { radius } from '../../../theme/tokens'

interface SwipeButtonProps {
  size: number
  direction: 'previous' | 'next'
  onPress: () => void
}

// Tamagui drops focusVisibleStyle when the same element sets `transition`, so no focusable
// control here animates — the keyboard ring is worth more than an eased hover.
// The design ships one asset pointing left and mirrors it for the right arrow, so this does too.
export function SwipeButton({ size, direction, onPress }: SwipeButtonProps) {
  return (
    <YStack
      width={size}
      height={size}
      borderRadius={radius.pill}
      scaleX={direction === 'next' ? -1 : 1}
      pressStyle={{ opacity: PRESS_OPACITY }}
      hoverStyle={{ opacity: PRESS_OPACITY }}
      {...pressable(onPress)}
      aria-label={direction === 'next' ? 'Next promotion' : 'Previous promotion'}
    >
      <SwipeCircle width={size} height={size} />
    </YStack>
  )
}
