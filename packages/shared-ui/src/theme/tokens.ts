// Colours and type scale come from Figma (file qaRkqLFqKabUtgnK2I4poR, laptop frame 28:6), each
// tagged with its variable name. Spacing, radius and layout are measured — Figma defines none.

export const palette = {
  white: '#FFFFFF', // white
  violet1: '#432E57', // VIOLET/violet-1
  violet2: '#260C39', // VIOLET/violet-2
  violet3: '#A993BD', // VIOLET/violet-3
  violet4: '#2C1A3D', // VIOLET/violet-4
  orange2: '#FE8607', // ORANGE/orange-2
  red: '#FF0A00', // red-2 — renamed: Tamagui's dark theme already owns `red2`
  night: '#10001F', // background
} as const

const positiveSpace = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  true: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 40,
  10: 48,
  11: 56,
  12: 64,
} as const

// Tamagui's defaults ship negative space; replacing the group would drop it.
const negativeSpace = {
  '-1': -4,
  '-2': -8,
  '-3': -12,
  '-4': -16,
  '-5': -20,
  '-6': -24,
  '-7': -28,
  '-8': -32,
  '-9': -40,
  '-10': -48,
} as const

export const space = { ...positiveSpace, ...negativeSpace }

// Measured off the laptop frame. Kept out of the Tamagui token groups deliberately: Tamagui steps
// tokens by sorted numeric value, so one-off numbers make `$4` step to the wrong neighbour.
export const layout = {
  gutter: 74, // page side margin
  contentWidth: 1218, // 1366 - (74 * 2)
  gridColumnGap: 17, // 46:52
  gridRowGap: 18, // 46:52
  gameTile: 230, // 46:52
  navHeight: 90, // 70:1363
  heroHeight: 455, // 49:177
  swipeButton: 32, // 49:177
  ratingsHeight: 144, // 55:566
  viewMoreWidth: 228, // 56:840
  viewMoreHeight: 46, // 56:840
} as const

// Not from Figma — the design's corners read as a 4/8/12/16 family plus pills.
export const radius = {
  0: 0,
  1: 4,
  2: 6,
  3: 8,
  true: 8,
  4: 12,
  5: 16,
  pill: 999,
} as const
