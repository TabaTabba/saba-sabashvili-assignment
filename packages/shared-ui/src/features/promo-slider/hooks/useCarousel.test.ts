import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AUTOPLAY_MS } from '../constants'
import { useCarousel } from './useCarousel'

describe('useCarousel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('wraps past the last step and before the first', () => {
    const { result } = renderHook(() => useCarousel(3, false))

    act(() => result.current.goTo(2))
    expect(result.current.index).toBe(2)

    act(() => result.current.goNext())
    expect(result.current.index).toBe(0)

    act(() => result.current.goPrevious())
    expect(result.current.index).toBe(2)
  })

  it('advances on its own until paused', () => {
    const { rerender, result } = renderHook(({ isPaused }) => useCarousel(3, isPaused), {
      initialProps: { isPaused: false },
    })

    act(() => void vi.advanceTimersByTime(AUTOPLAY_MS))
    expect(result.current.index).toBe(1)

    rerender({ isPaused: true })
    act(() => void vi.advanceTimersByTime(AUTOPLAY_MS * 3))
    expect(result.current.index).toBe(1)

    rerender({ isPaused: false })
    act(() => void vi.advanceTimersByTime(AUTOPLAY_MS))
    expect(result.current.index).toBe(2)
  })

  // Without the restart, a click landing just before a tick would be followed almost immediately
  // by an automatic advance.
  it('restarts the interval after manual navigation', () => {
    const { result } = renderHook(() => useCarousel(3, false))

    act(() => void vi.advanceTimersByTime(AUTOPLAY_MS - 100))
    act(() => result.current.goNext())
    expect(result.current.index).toBe(1)

    act(() => void vi.advanceTimersByTime(200))
    expect(result.current.index).toBe(1)

    act(() => void vi.advanceTimersByTime(AUTOPLAY_MS))
    expect(result.current.index).toBe(2)
  })

  it('holds still with a single step', () => {
    const { result } = renderHook(() => useCarousel(1, false))

    act(() => void vi.advanceTimersByTime(AUTOPLAY_MS * 3))
    expect(result.current.index).toBe(0)
  })

  // A refetch can return fewer slides than are currently on screen.
  it('clamps the index when the step count shrinks', () => {
    const { rerender, result } = renderHook(({ steps }) => useCarousel(steps, true), {
      initialProps: { steps: 4 },
    })

    act(() => result.current.goTo(3))
    expect(result.current.index).toBe(3)

    rerender({ steps: 2 })
    expect(result.current.index).toBe(1)
  })
})
