import type { HeroSlide } from '@duxcasino/shared-api'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Text, XStack, YStack } from 'tamagui'

import { aboveGradient } from '../../../lib/gradient'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'
import { fontWeight } from '../../../theme/fonts'
import { ARTWORK_FADE_WIDTH } from '../constants'
import type { PromoCardGeometry } from '../types'
import { SlideArtwork } from './SlideArtwork'

interface PromoCardProps {
  slide: HeroSlide
  size: PromoCardGeometry
  onPressCta: () => void
}

// The tablet (70:1292) and phone (96:5031) frames. Two deliberate substitutions, both noted in
// PROGRESS: the amount is Montserrat Bold 32 in Figma and Rubik Bold 32 here, and the design tints
// part of the subline orange, which needs a copy split the mock API does not carry.
export function PromoCard({ slide, size, onPressCta }: PromoCardProps) {
  return (
    <XStack
      width={size.cardWidth}
      height={size.cardHeight}
      borderRadius="$4"
      overflow="hidden"
      backgroundColor="$surface"
    >
      <YStack
        position="absolute"
        top={0}
        bottom={0}
        right={0}
        width={size.cardWidth - size.textWidth - size.padding}
      >
        <SlideArtwork uri={slide.imageUrl} alt={slide.heading} />
        <LinearGradient
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          width={ARTWORK_FADE_WIDTH}
          colors={['$scrimStart', '$scrimEnd']}
          start={[0, 0]}
          end={[1, 0]}
        />
      </YStack>

      <YStack
        width={size.textWidth + size.padding}
        height="100%"
        paddingLeft={size.padding}
        paddingVertical={size.padding}
        justifyContent="space-between"
      >
        <YStack gap={size.textGap}>
          <Text fontSize="$4" lineHeight="$4" fontWeight={fontWeight.medium} color="$color">
            {slide.heading}
          </Text>
          <Text fontSize="$8" lineHeight="$8" fontWeight={fontWeight.bold} color="$promoAmount">
            {slide.amount}
          </Text>
          <Text fontSize="$3" lineHeight="$3" fontWeight={fontWeight.medium} color="$color">
            {slide.subline}
          </Text>
        </YStack>

        <LinearGradient
          height={size.ctaHeight}
          borderRadius="$pill"
          paddingHorizontal={size.ctaPaddingHorizontal}
          alignSelf="flex-start"
          colors={['$promoCtaStart', '$promoCtaEnd']}
          start={[0, 0]}
          end={[1, 0]}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: PRESS_OPACITY }}
          hoverStyle={{ opacity: PRESS_OPACITY }}
          {...pressable(onPressCta)}
        >
          <Text
            {...aboveGradient}
            fontSize="$3"
            lineHeight="$3"
            fontWeight={fontWeight.semibold}
            textTransform="uppercase"
            color="$color"
          >
            {slide.ctaLabel}
          </Text>
        </LinearGradient>
      </YStack>
    </XStack>
  )
}
