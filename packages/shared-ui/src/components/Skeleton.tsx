import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

// The design has no loading state; this is a raised surface at the caller's corner radius.
const PULSE_MS = 700
const DIM = 0.45

interface SkeletonProps {
  width: number | '100%'
  height: number
  borderRadius: number
  label: string
}

export function Skeleton({ width, height, borderRadius, label }: SkeletonProps) {
  const [isDim, setIsDim] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setIsDim(dim => !dim), PULSE_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <YStack
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor="$surfaceRaised"
      opacity={isDim ? DIM : 1}
      transition="slow"
      aria-busy
      aria-label={label}
    />
  )
}
