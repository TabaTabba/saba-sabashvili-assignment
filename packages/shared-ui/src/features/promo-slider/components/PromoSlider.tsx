import { useHeroSlides } from '@duxcasino/shared-api'
import { useUserStore } from '@duxcasino/shared-stores'
import { LinearGradient } from '@tamagui/linear-gradient'
import { useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { Text, XStack, YStack, useMedia } from 'tamagui'

import { Skeleton } from '../../../components/Skeleton'
import { DEMO_USER } from '../../../lib/demoUser'
import { pressable } from '../../../lib/pressable'
import { promo, radius } from '../../../theme/tokens'
import { useCarousel } from '../hooks/useCarousel'
import { HeroSlide } from './HeroSlide'
import { PagingDots } from './PagingDots'
import { PaymentsStrip, paymentsStripHeight } from './PaymentsStrip'
import { PromoCard } from './PromoCard'
import { SwipeButton } from './SwipeButton'

const { hero } = promo

// The laptop frame draws a hero banner, the smaller frames a card carousel. One track with one
// index, so autoplay, wrapping and keyboard behaviour are written once.
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

  // Measured, not derived from the breakpoint: 1024 fits two and a half cards, so a step count
  // pinned to the tablet frame stops with dead space. One position until onLayout runs, never a guess.
  const viewport = Math.max(0, trackWidth - (isHero ? 0 : size.gutter * 2))
  const step = isHero ? viewport : size.cardWidth + size.cardGap
  const trackLength = isHero
    ? viewport * slideCount
    : size.cardWidth * slideCount + size.cardGap * Math.max(0, slideCount - 1)
  const maxOffset = Math.max(0, trackLength - viewport)
  const stepCount = viewport > 0 ? Math.max(1, Math.ceil(maxOffset / step) + 1) : 1

  const { index, goTo, goNext, goPrevious } = useCarousel(stepCount, isPaused)
  const offset = Math.min(index * step, maxOffset)

  // No auth in this build, so the CTA takes the same demo sign-in the header does.
  function claimPromo() {
    if (!user) signIn(DEMO_USER)
  }

  // Loading and error reserve the loaded height, so the page below does not jump on settle.
  const sectionHeight = isHero
    ? hero.height
    : size.cardHeight + size.dotRowHeight + paymentsStripHeight(size.cardWidth)

  const arrowSize = isHero ? hero.arrowSize : size.arrowSize
  const arrowInset = isHero ? hero.arrowInset : size.arrowInset
  const arrowTop = isHero ? hero.arrowTop : (size.cardHeight - size.arrowSize) / 2

  // One wrapper across all three states, so the landmark and hover-to-pause do not come and go.
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
        <YStack height={sectionHeight} alignItems="center" justifyContent="center" gap="$3">
          <Text fontSize="$4" color="$colorMuted">
            Promotions are unavailable right now.
          </Text>
          <Text fontSize="$3" color="$accent" {...pressable(() => refetch())}>
            Try again
          </Text>
        </YStack>
      ) : isPending || !slides ? (
        <YStack
          height={sectionHeight}
          paddingHorizontal={isHero ? 0 : size.gutter}
          // A card sits at its section's top left; centring the skeleton slides it on load.
          alignItems="flex-start"
          justifyContent={isHero ? 'center' : 'flex-start'}
        >
          <Skeleton
            width={isHero ? '100%' : size.cardWidth}
            height={isHero ? hero.bannerHeight : size.cardHeight}
            borderRadius={radius[4]}
            label="Loading promotions"
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
