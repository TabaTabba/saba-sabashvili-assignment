import { LinearGradient } from '@tamagui/linear-gradient'
import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

import { SlideImage } from './SlideImage'

interface SlideArtworkProps {
  uri: string
  alt: string
}

// Owns the failure state so the two platform SlideImage files stay free of everything but the
// element itself. The fallback is the card surface fading into the page, which reads as part of
// the design rather than as a broken image.
export function SlideArtwork({ uri, alt }: SlideArtworkProps) {
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => setHasFailed(false), [uri])

  if (hasFailed) {
    return (
      <LinearGradient
        width="100%"
        height="100%"
        colors={['$surfaceRaised', '$background']}
        start={[0, 0]}
        end={[1, 1]}
        aria-label={alt}
      />
    )
  }

  return (
    <YStack width="100%" height="100%">
      <SlideImage uri={uri} alt={alt} onError={() => setHasFailed(true)} />
    </YStack>
  )
}
