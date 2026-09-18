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

  signUpTop: palette.lilacSoft,
  signUpBottom: palette.lilacStrong,

  // Tamagui's LinearGradient resolves `colors` against the theme, so gradient stops need theme
  // keys rather than palette entries.
  heroCtaTop: palette.orangeLight,
  heroCtaBottom: palette.orange2,
  promoCtaStart: palette.orangeWarm,
  promoCtaEnd: palette.orangeDeep,

  // Blends the promo card's artwork into its text column, and the card track into the page edge.
  scrimStart: palette.violet2,
  scrimEnd: palette.violet2Clear,
  trackFadeStart: palette.nightClear,
  trackFadeEnd: palette.night,

  // The games counter badge (77:1419) and the HOT RTP tile badge (107:3820) are both gradients,
  // so their stops need theme keys too.
  counterTop: palette.violet7,
  counterBottom: palette.violetDeep,
  hotRtpStart: palette.redSoft,
  hotRtpEnd: palette.orangeSoft,
  hotRtpBorder: palette.red,
  linesBadge: palette.violet1,
  tileScrimStart: palette.nightClear,
  tileScrimEnd: palette.night,
  counterChip: palette.blue,

  promoAmount: palette.orange3,
  swipe: palette.blue,
  pagingActive: palette.white,
  pagingIdle: palette.violet1,
  pagingIdleSmall: palette.violet7,

  accent: palette.orange2,
  accentHover: palette.orange2,
  accentPress: palette.orange2,
  onAccent: palette.white,

  danger: palette.red,
} as const

export const themes = {
  dark: { ...defaultThemes.dark, ...darkOverrides },
}
