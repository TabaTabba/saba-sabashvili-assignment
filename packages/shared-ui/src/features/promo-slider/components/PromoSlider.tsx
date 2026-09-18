import { useHeroSlides } from '@duxcasino/shared-api'
import { useUserStore } from '@duxcasino/shared-stores'
import { LinearGradient } from '@tamagui/linear-gradient'
import { useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { Text, XStack, YStack, useMedia } from 'tamagui'

import { DEMO_USER } from '../../../lib/demoUser'
import { pressable } from '../../../lib/pressable'
import { promo, radius } from '../../../theme/tokens'
import { useCarousel } from '../hooks/useCarousel'
import { HeroSlide } from './HeroSlide'
import { PagingDots } from './PagingDots'
import { PaymentsStrip } from './PaymentsStrip'
import { PromoCard } from './PromoCard'
import { PromoSkeleton } from './PromoSkeleton'
import { SwipeButton } from './SwipeButton'

const { hero } = promo

// The design draws two different components in this slot: the laptop page a full-bleed hero banner
// (49:177), the tablet and phone pages a carousel of promo cards (72:1306, 96:5100). Both are one
// track with one index, so autoplay, wrapping and the keyboard behaviour are written once.
//
// Three deviations from the frames, all taken for the brief:
// - the phone frame has no arrows, only dots. The brief requires arrows, so the tablet's 24px pair
//   carries over and the dots stay as the larger target.
// - the payments strip sits inside the hero block at $xl per the design, and below the dots on the
//   card layouts, where the design defers it to a separate footer section.
// - the track is translated a card at a time and clamped at its end rather than free-scrolled;
//   a translated track behaves identically on both platforms, a ScrollView's snapping does not.
export function PromoSlider() {
  const media = useMedia()
  const { data: slides, isPending, isError, refetch } = useHeroSlides()
  const user = useUserStore(state => state.user)
  const signIn = useUserStore(state => state.signIn)
  const [isPaused, setIsPaused] = useState(false)
  const [trackWidth, setTrackWidth] = useState(0)

  const isHero = media.xl
  const size = media.md ? promo.tablet : promo.phone
  const slideCount = slides?.length ?? 0

  // Resting positions come from the measured track, not from the breakpoint: 1024 fits two and a
  // half cards, so a step count pinned to the tablet frame would stop with dead space on the right.
  // Until onLayout has run there is one position, not a guess — a guess renders the wrong number
  // of dots for a frame, because the card step is a constant and only the viewport is unknown.
  const viewport = Math.max(0, trackWidth - (isHero ? 0 : size.gutter * 2))
  const step = isHero ? viewport : size.cardWidth + size.cardGap
  const trackLength = isHero
    ? viewport * slideCount
    : size.cardWidth * slideCount + size.cardGap * Math.max(0, slideCount - 1)
  const maxOffset = Math.max(0, trackLength - viewport)
  const stepCount = viewport > 0 ? Math.max(1, Math.ceil(maxOffset / step) + 1) : 1

  const { index, goTo, goNext, goPrevious } = useCarousel(stepCount, isPaused)
  const offset = Math.min(index * step, maxOffset)

  // Every promo in the design needs an account, so the CTA takes the same demo sign-in the header
  // does. Once signed in there is nowhere for it to go in this build.
  function claimPromo() {
    if (!user) signIn(DEMO_USER)
  }

  const arrowSize = isHero ? hero.arrowSize : size.arrowSize
  const arrowInset = isHero ? hero.arrowInset : size.arrowInset
  const arrowTop = isHero ? hero.arrowTop : (size.cardHeight - size.arrowSize) / 2

  // The region wrapper stays put across all three states so the landmark, and the hover-to-pause
  // it carries, do not come and go with the query.
  return (
    <YStack
      width="100%"
      maxWidth={hero.frameWidth}
      alignSelf="center"
      aria-label="Promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') goNext()
        if (event.key === 'ArrowLeft') goPrevious()
      }}
    >
      {isError ? (
        <YStack
          height={isHero ? hero.height : size.cardHeight}
          alignItems="center"
          justifyContent="center"
          gap="$3"
        >
          <Text fontSize="$4" color="$colorMuted">
            Promotions are unavailable right now.
          </Text>
          <Text fontSize="$3" color="$accent" {...pressable(() => refetch())}>
            Try again
          </Text>
        </YStack>
      ) : isPending || !slides ? (
        <YStack paddingHorizontal={isHero ? 0 : size.gutter} alignItems="center">
          <PromoSkeleton
            width={isHero ? '100%' : size.cardWidth}
            height={isHero ? hero.bannerHeight : size.cardHeight}
            borderRadius={radius[4]}
          />
        </YStack>
      ) : (
        <>
          <YStack
            overflow="hidden"
            paddingHorizontal={isHero ? 0 : size.gutter}
            onLayout={(event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)}
          >
            <XStack gap={isHero ? 0 : size.cardGap} x={-offset} transition="medium">
              {slides.map(slide =>
                isHero ? (
                  <HeroSlide
                    key={slide.id}
                    slide={slide}
                    width={viewport}
                    onPressCta={claimPromo}
                  />
                ) : (
                  <PromoCard key={slide.id} slide={slide} size={size} onPressCta={claimPromo} />
                ),
              )}
            </XStack>

            {size.fadeWidth > 0 && !isHero ? (
              <LinearGradient
                position="absolute"
                top={0}
                right={size.gutter}
                width={size.fadeWidth}
                height={size.cardHeight}
                colors={['$trackFadeStart', '$trackFadeEnd']}
                start={[0, 0]}
                end={[1, 0]}
                pointerEvents="none"
              />
            ) : null}
          </YStack>

          <YStack position="absolute" top={arrowTop} left={arrowInset}>
            <SwipeButton size={arrowSize} direction="previous" onPress={goPrevious} />
          </YStack>
          <YStack position="absolute" top={arrowTop} right={arrowInset}>
            <SwipeButton size={arrowSize} direction="next" onPress={goNext} />
          </YStack>

          {isHero ? null : (
            <YStack alignItems="center">
              <PagingDots
                count={stepCount}
                index={index}
                onSelect={goTo}
                size={size}
                idleColor={media.md ? '$pagingIdle' : '$pagingIdleSmall'}
              />
              <PaymentsStrip width={size.cardWidth} />
            </YStack>
          )}
        </>
      )}
    </YStack>
  )
}
