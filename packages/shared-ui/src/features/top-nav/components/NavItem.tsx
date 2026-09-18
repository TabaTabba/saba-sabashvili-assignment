import { Text } from 'tamagui'

import { fontWeight } from '../../../theme/fonts'

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
      cursor="pointer"
      hoverStyle={{ color: '$accent' }}
      pressStyle={{ color: '$accent' }}
      onPress={onPress}
      role="button"
    >
      {label}
    </Text>
  )
}
