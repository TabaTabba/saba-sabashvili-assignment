import { View, YStack } from 'tamagui'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'

import { nav } from '../../../theme/tokens'

interface BurgerButtonProps {
  size: number
  isOpen: boolean
  onPress: () => void
}

export function BurgerButton({ size, isOpen, onPress }: BurgerButtonProps) {
  return (
    <YStack
      width={size}
      height={size}
      alignItems="center"
      justifyContent="center"
      gap={nav.burgerBarGap}
      pressStyle={{ opacity: PRESS_OPACITY }}
      {...pressable(onPress)}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {[0, 1, 2].map(bar => (
        <View
          key={bar}
          width={nav.burgerBarWidth}
          height={nav.burgerBarHeight}
          borderRadius="$1"
          backgroundColor={isOpen ? '$accent' : '$color'}
        />
      ))}
    </YStack>
  )
}
