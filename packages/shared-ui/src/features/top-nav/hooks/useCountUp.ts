import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 600

export function useCountUp(target: number | null): number | null {
  const [value, setValue] = useState(target)
  const valueRef = useRef(target)

  useEffect(() => {
    const from = valueRef.current

    if (target === null || from === null || from === target) {
      valueRef.current = target
      setValue(target)
      return
    }

    let frame = 0
    const startedAt = Date.now()

    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / DURATION_MS)
      const next = from + (target - from) * (1 - (1 - progress) ** 3)

      valueRef.current = next
      setValue(next)

      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}
