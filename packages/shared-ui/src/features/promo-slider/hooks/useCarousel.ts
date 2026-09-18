import { useCallback, useEffect, useState } from 'react'

import { AUTOPLAY_MS } from '../constants'

// `stepCount` is the number of resting positions, not the number of slides: the tablet frame shows
// two cards at once, so four slides rest in three places.
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
    // `index` is a dependency so manual navigation restarts the interval rather than leaving the
    // next automatic advance a few hundred milliseconds away.
    const timer = setInterval(() => setStep(current => (current + 1) % stepCount), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [index, isPaused, stepCount])

  return { index, goTo, goNext, goPrevious }
}
