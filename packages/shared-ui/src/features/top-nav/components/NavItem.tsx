import { Text } from 'tamagui'

import { fontWeight } from '../../../theme/fonts'
import { pressable } from '../../../lib/pressable'

interface NavItemProps {
  label: string
  isActive?: boolean
  onPress?: () => void
}

export function NavItem({ label, isActive, onPress }: NavItemProps) {
  return (
    <Text
      fontSize="$2"
      fontWeight={fontWeight.bold}
      textTransform="uppercase"
      color={isActive ? '$accent' : '$color'}
      hoverStyle={{ color: '$accent' }}
      pressStyle={{ color: '$accent' }}
      {...(onPress ? pressable(onPress) : {})}
    >
      {label}
    </Text>
  )
}
