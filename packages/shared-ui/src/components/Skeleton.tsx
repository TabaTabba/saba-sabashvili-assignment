import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

// The design has no loading state; this is a raised surface at the caller's corner radius.
const PULSE_MS = 700
const DIM = 0.45

// A fixed box for the slider, a flex-distributed square for the grid. Either pair, never a mix and
// never neither — four optional props would have let a caller render a silent 0x0.
type SkeletonSize =
  { width: number | '100%'; height: number } | { flex: number; aspectRatio: number }

type SkeletonProps = SkeletonSize & {
  borderRadius: number
  label: string
}

export function Skeleton({ borderRadius, label, ...size }: SkeletonProps) {
  const [isDim, setIsDim] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setIsDim(dim => !dim), PULSE_MS)
    return () => clearInterval(timer)
  }, [])

  // The pulse is on an inner fill because Tamagui's `transition` covers every animatable property.
  // On the sized box it animated width and height too, so a skeleton reaching its measured size
  // shifted the page once per frame.
  return (
    <YStack {...size} aria-busy aria-label={label}>
      <YStack
        flex={1}
        borderRadius={borderRadius}
        backgroundColor="$surfaceRaised"
        opacity={isDim ? DIM : 1}
        transition="slow"
      />
    </YStack>
  )
}
