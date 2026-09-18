import { View, YStack } from 'tamagui'

import { nav } from '../../../theme/tokens'
import { PRESS_OPACITY } from '../constants'

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
      cursor="pointer"
      pressStyle={{ opacity: PRESS_OPACITY }}
      onPress={onPress}
      role="button"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
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
