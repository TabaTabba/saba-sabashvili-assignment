import { XStack, View } from 'tamagui'

import { pressable } from '../../../lib/pressable'
import { promo } from '../../../theme/tokens'
import type { PromoCardGeometry } from '../types'

interface PagingDotsProps {
  count: number
  index: number
  onSelect: (index: number) => void
  size: PromoCardGeometry
  idleColor: '$pagingIdle' | '$pagingIdleSmall'
}

export function PagingDots({ count, index, onSelect, size, idleColor }: PagingDotsProps) {
  return (
    <XStack
      height={size.dotRowHeight}
      alignItems="center"
      justifyContent="center"
      gap={size.dotGap}
      role="tablist"
    >
      {Array.from({ length: count }, (_, dot) => (
        <View
          key={dot}
          width={size.dotWidth}
          height={size.dotHeight}
          borderRadius={promo.dotRadius}
          backgroundColor={dot === index ? '$pagingActive' : idleColor}
          {...pressable(() => onSelect(dot))}
          aria-label={`Promotion ${dot + 1}`}
          aria-selected={dot === index}
        />
      ))}
    </XStack>
  )
}
