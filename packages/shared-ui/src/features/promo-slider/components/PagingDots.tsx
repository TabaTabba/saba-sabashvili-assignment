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
      role="group"
      aria-label="Promotion pages"
    >
      {Array.from({ length: count }, (_, dot) => (
        // A dot is a scroll position, not a slide — two cards share one at 768, and 1024 fits four
        // slides in three steps. Labelling them "Promotion N" claimed a slide count the track does
        // not have. aria-current rather than aria-selected, which pressable's role="button" cannot
        // carry.
        <View
          key={dot}
          width={size.dotWidth}
          height={size.dotHeight}
          borderRadius={promo.dotRadius}
          backgroundColor={dot === index ? '$pagingActive' : idleColor}
          {...pressable(() => onSelect(dot))}
          aria-label={`Page ${dot + 1} of ${count}`}
          aria-current={dot === index}
        />
      ))}
    </XStack>
  )
}
