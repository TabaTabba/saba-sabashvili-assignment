import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

import { SKELETON_DIM, SKELETON_PULSE_MS } from '../constants'

interface PromoSkeletonProps {
  width: number | '100%'
  height: number
  borderRadius: number
}

export function PromoSkeleton({ width, height, borderRadius }: PromoSkeletonProps) {
  const [isDim, setIsDim] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setIsDim(dim => !dim), SKELETON_PULSE_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <YStack
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor="$surfaceRaised"
      opacity={isDim ? SKELETON_DIM : 1}
      transition="slow"
      aria-busy
      aria-label="Loading promotions"
    />
  )
}
