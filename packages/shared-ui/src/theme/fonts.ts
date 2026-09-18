import { createFont, isWeb } from 'tamagui'

export const fontWeight = {
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

const rubikFamily = isWeb
  ? 'Rubik, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  : 'Rubik_500Medium'

// Rubik at 10/12/14/16/20/22/30/32/112. Line height is 100% except CAPS/H3 (30 on 35) and the two
// steps Figma leaves on auto, which it renders at 1.1875x — the €500 text box measures 133 on 112.
export const rubik = createFont({
  family: rubikFamily,
  size: {
    1: 10, // CAPS/H9 - bold
    2: 12, // H8, CAPS/H8
    3: 14, // H7, TITLE/H7, CAPS/H7
    true: 14,
    4: 16, // H6, CAPS/H6
    5: 20, // H5
    6: 22, // CAPS/H4
    7: 30, // CAPS/H3
    8: 32, // H4 — Montserrat in Figma, see the substitution note in PromoCard
    9: 112, // CAPS/HERO
  },
  lineHeight: {
    1: 10,
    2: 12,
    3: 14,
    true: 14,
    4: 16,
    5: 20,
    6: 22,
    7: 35,
    8: 38,
    9: 133,
  },
  // Weight keys follow size keys. 12/14/16 carry two Figma styles (sentence case and CAPS), so
  // they default to sentence case and CAPS sets fontWeight; the rest match their one Figma style.
  weight: {
    1: '700',
    2: '500',
    3: '500',
    true: '500',
    4: '500',
    5: '600',
    6: '700',
    7: '700',
    8: '700',
    9: '700',
  },
  letterSpacing: {
    1: 0,
    true: 0,
  },
  // Native has no synthetic weights. No Regular 400 — no Figma style uses it.
  face: {
    500: { normal: 'Rubik_500Medium' },
    600: { normal: 'Rubik_600SemiBold' },
    700: { normal: 'Rubik_700Bold' },
  },
})
