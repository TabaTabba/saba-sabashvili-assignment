import { themes as defaultThemes } from '@tamagui/config/v4'

import { palette } from './tokens'

// Layered over Tamagui's dark rather than replacing it — the defaults carry ~130 keys built-ins
// read (outlineColor, placeholderColor, shadowColor). Only `dark` is kept: Tamagui types themes by
// their shared shape, so carrying the other 293 would drop $accent and $colorMuted from the type.
const darkOverrides = {
  background: palette.night,
  backgroundHover: palette.violet4,
  backgroundPress: palette.violet2,
  backgroundFocus: palette.violet4,

  surface: palette.violet2,
  surfaceRaised: palette.violet4,

  color: palette.white,
  colorHover: palette.white,
  colorPress: palette.violet3,
  colorFocus: palette.white,
  colorMuted: palette.violet3,

  borderColor: palette.violet1,
  borderColorHover: palette.violet3,
  borderColorPress: palette.violet1,
  borderColorFocus: palette.violet3,

  outlineColor: palette.violet3,
  placeholderColor: palette.violet3,
  shadowColor: palette.night,

  accent: palette.orange2,
  accentHover: palette.orange2,
  accentPress: palette.orange2,
  onAccent: palette.white,

  danger: palette.red,
} as const

export const themes = {
  dark: { ...defaultThemes.dark, ...darkOverrides },
}
