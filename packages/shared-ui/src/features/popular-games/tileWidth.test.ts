import { describe, expect, it } from 'vitest'

import { games } from '../../theme/tokens'
import { tileWidth } from './tileWidth'

describe('tileWidth', () => {
  it('returns the laptop frame tile at the laptop frame width', () => {
    const { columns, columnGap, gutter, tileSize } = games.laptop
    expect(tileWidth(games.frameWidth - gutter * 2, columns, columnGap)).toBe(tileSize)
  })

  it('is zero before the container has been measured', () => {
    expect(tileWidth(0, games.phone.columns, games.phone.columnGap)).toBe(0)
  })

  it('fills the row exactly, so the grid never overflows its gutters', () => {
    const content = 736
    const { columns, columnGap } = games.tablet
    const tile = tileWidth(content, columns, columnGap)
    expect(tile * columns + columnGap * (columns - 1)).toBeCloseTo(content, 6)
  })
})
