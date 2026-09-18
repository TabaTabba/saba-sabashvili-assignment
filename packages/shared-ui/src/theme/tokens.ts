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
  lilacSoft: 'rgba(219, 182, 255, 0.23)',
  lilacStrong: 'rgba(219, 182, 255, 0.35)',
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

// Header geometry, measured off all three design frames: phone 96:4918, tablet 70:1473,
// laptop 70:1363. Mobile-first — a component takes `phone` as its base and overrides at $md/$xl.
export const nav = {
  phone: {
    height: 50,
    gutter: 16,
    logoWidth: 101.37,
    logoHeight: 18,
    authWidth: 78,
    authHeight: 30,
    authGap: 4,
    controlSize: 30,
    flagWidth: 14.93,
    flagHeight: 10.67,
    // Not in the phone frame — the design has no burger there. See the drawer note in TopNav.
    burgerGap: 8,
    // The phone frame spaces its three groups evenly, with no padded block.
    leftBlockWidth: undefined,
    rowPaddingBottom: 0,
    frameWidth: undefined,
  },
  tablet: {
    height: 100,
    gutter: 16,
    logoWidth: 148.5,
    logoHeight: 27,
    authWidth: 120,
    authHeight: 45,
    authGap: 7.5,
    controlSize: 45,
    flagWidth: 22.4,
    flagHeight: 16,
    burgerGap: 20, // left block 70:1529 — burger ends at 45, logo starts at 65
    // 70:1529 is 368.5 wide but its content ends at 213.5. Without that trailing space the
    // space-between distribution puts the Login pair ~78px left of the frame.
    leftBlockWidth: 368.5,
    // The tablet frame is the one that is not vertically centred: its 45px controls sit at y=17.5
    // in a 100px header, 10px above centre. Reserved as bottom padding.
    rowPaddingBottom: 20,
    frameWidth: undefined,
  },
  laptop: {
    height: 90,
    gutter: 74,
    logoWidth: 198,
    logoHeight: 36,
    authWidth: 120,
    authHeight: 45,
    authGap: 10,
    controlSize: 45,
    flagWidth: 22.4,
    flagHeight: 16,
    burgerGap: 0, // the laptop header has no burger; present so the three shapes match
    leftBlockWidth: undefined,
    rowPaddingBottom: 0,
    frameWidth: 1366,
    itemGap: 34,
    caretGap: 4,
  },
  // Shared across breakpoints.
  authRadius: 25,
  borderWidth: 2,
  caretWidth: 8.66,
  caretHeight: 4.5,
  // burger Menu 70:1522 — three 14x2 bars on a 5px pitch.
  burgerBarWidth: 14,
  burgerBarHeight: 2,
  burgerBarGap: 3,
} as const
