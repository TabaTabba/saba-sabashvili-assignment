import type { HeroSlide as HeroSlideData } from '@duxcasino/shared-api'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Text, YStack } from 'tamagui'

import { fontWeight } from '../../../theme/fonts'
import { aboveGradient } from '../../../lib/gradient'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'
import { promo } from '../../../theme/tokens'
import { PaymentsStrip } from './PaymentsStrip'
import { SlideArtwork } from './SlideArtwork'

const { hero } = promo

interface HeroSlideProps {
  slide: HeroSlideData
  width: number
  onPressCta: () => void
}

export function HeroSlide({ slide, width, onPressCta }: HeroSlideProps) {
  return (
    <YStack width={width} height={hero.height} justifyContent="center">
      <YStack height={hero.bannerHeight} borderRadius="$4" overflow="hidden">
        <SlideArtwork uri={slide.imageUrl} alt={slide.heading} />
      </YStack>

      <YStack
        position="absolute"
        top={hero.blockTop}
        left={0}
        right={0}
        height={hero.blockHeight}
        alignItems="center"
        justifyContent="center"
        gap={hero.blockGap}
      >
        <YStack width={hero.blockWidth} alignItems="center" gap={hero.innerGap} overflow="hidden">
          <Text
            fontSize="$7"
            lineHeight="$7"
            fontWeight={fontWeight.bold}
            textTransform="uppercase"
            color="$color"
          >
            {slide.heading}
          </Text>
          <Text
            fontSize="$9"
            lineHeight="$9"
            fontWeight={fontWeight.bold}
            textTransform="uppercase"
            color="$color"
          >
            {slide.amount}
          </Text>
          <Text
            fontSize="$7"
            lineHeight="$7"
            fontWeight={fontWeight.bold}
            textTransform="uppercase"
            color="$color"
          >
            {slide.subline}
          </Text>

          <LinearGradient
            width={hero.ctaWidth}
            height={hero.ctaHeight}
            borderRadius="$1"
            colors={['$heroCtaTop', '$heroCtaBottom']}
            start={[0, 0]}
            end={[0, 1]}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: PRESS_OPACITY }}
            hoverStyle={{ opacity: PRESS_OPACITY }}
            {...pressable(onPressCta)}
          >
            <Text
              {...aboveGradient}
              fontSize="$6"
              lineHeight="$6"
              fontWeight={fontWeight.bold}
              textTransform="uppercase"
              color="$color"
            >
              {slide.ctaLabel}
            </Text>
          </LinearGradient>
        </YStack>

        <PaymentsStrip width={hero.blockWidth} />
      </YStack>
    </YStack>
  )
}
