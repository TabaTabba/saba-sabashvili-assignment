import { useCallback, useEffect, useState } from 'react'

import { AUTOPLAY_MS } from '../constants'

// `stepCount` is resting positions, not slides — two cards share a step, so four slides rest in three.
export function useCarousel(stepCount: number, isPaused: boolean) {
  const [step, setStep] = useState(0)

  // A refetch can return fewer slides than are currently shown.
  const index = stepCount > 0 ? Math.min(step, stepCount - 1) : 0

  const goTo = useCallback(
    (next: number) => {
      if (stepCount < 1) return
      setStep(((next % stepCount) + stepCount) % stepCount)
    },
    [stepCount],
  )

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrevious = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (isPaused || stepCount < 2) return
    // `index` is a dependency so manual navigation restarts the interval.
    const timer = setInterval(() => setStep(current => (current + 1) % stepCount), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [index, isPaused, stepCount])

  return { index, goTo, goNext, goPrevious }
}
