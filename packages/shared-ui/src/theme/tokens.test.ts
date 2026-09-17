import { themes as defaultThemes } from '@tamagui/config/v4'
import { describe, expect, it } from 'vitest'

import { palette } from './tokens'

// Tamagui resolves `$name` against the theme before the colour tokens, so a palette key that also
// exists in Tamagui's dark theme is silently shadowed — `$red2` painted Tamagui's ramp, not red.
describe('palette', () => {
  const themeKeys = Object.keys(defaultThemes.dark)

  it.each(Object.keys(palette))('$%s is not shadowed by a Tamagui theme key', name => {
    expect(themeKeys).not.toContain(name)
  })
})
