import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCountUp } from './useCountUp'

type Props = { target: number | null }

function renderCountUp(target: number | null) {
  const seen: (number | null)[] = []

  const view = renderHook(
    ({ target: next }: Props) => {
      const value = useCountUp(next)
      seen.push(value)
      return value
    },
    { initialProps: { target } },
  )

  return { ...view, seen }
}

describe('useCountUp', () => {
  it('adopts the first value without tweening', () => {
    const { result } = renderCountUp(100)

    expect(result.current).toBe(100)
  })

  it('passes through intermediate values and lands exactly on the target', async () => {
    const { rerender, seen } = renderCountUp(100)

    rerender({ target: 200 })
    await waitFor(() => expect(seen.at(-1)).toBe(200))

    expect(seen.some(value => value !== null && value > 100 && value < 200)).toBe(true)
  })

  it('lands on the latest target when one arrives mid-tween', async () => {
    const { rerender, seen } = renderCountUp(100)

    rerender({ target: 200 })
    await waitFor(() => expect(seen.length).toBeGreaterThan(2))
    rerender({ target: 50 })

    await waitFor(() => expect(seen.at(-1)).toBe(50))
  })

  it('clears to null when the balance goes away', async () => {
    const { result, rerender } = renderCountUp(100)

    rerender({ target: null })

    await waitFor(() => expect(result.current).toBeNull())
  })
})
