// Colours and type scale come from Figma (file qaRkqLFqKabUtgnK2I4poR, laptop frame 28:6), each
// tagged with its variable name. Spacing, radius and geometry are measured — Figma defines none.

export const palette = {
  white: '#FFFFFF', // white
  violet1: '#432E57', // VIOLET/violet-1
  violet2: '#260C39', // VIOLET/violet-2
  violet3: '#A993BD', // VIOLET/violet-3
  violet4: '#2C1A3D', // VIOLET/violet-4
  violet7: '#553E6B', // VIOLET/violet-7
  orange2: '#FE8607', // ORANGE/orange-2
  orange3: '#FD972B', // ORANGE/orange-3
  red: '#FF0A00', // red-2 — renamed: Tamagui's dark theme already owns `red2`
  night: '#10001F', // background
  lilacSoft: 'rgba(219, 182, 255, 0.23)',
  lilacStrong: 'rgba(219, 182, 255, 0.35)',
  // Zero-alpha twins of violet2 and night. A gradient to a transparent *black* interpolates
  // through grey on both platforms, so each fade ends on its own colour at alpha 0.
  violet2Clear: 'rgba(38, 12, 57, 0)',
  nightClear: 'rgba(16, 0, 31, 0)',
  // The four below are raw fills in Figma, not named variables, so they carry descriptive names.
  orangeLight: '#FEB83F', // hero CTA gradient, top stop
  orangeWarm: '#FB9B33', // promo-card CTA gradient, start
  orangeDeep: '#FD652E', // promo-card CTA gradient, end
  blue: '#2D66F6', // swipe button circle and the games counter chip
  violetDeep: '#3E2952', // games counter badge gradient, end (77:1419)
  redSoft: 'rgba(255, 10, 0, 0.7)', // HOT RTP badge gradient, start (107:3820)
  orangeSoft: 'rgba(253, 110, 21, 0.7)', // HOT RTP badge gradient, end
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

// Measured off laptop 49:177 (a hero banner), tablet 72:1306 and phone 96:5100 (a card carousel).
// `tablet` and `phone` share a key shape so one lookup picks either; `hero` lays out nothing alike.
export const promo = {
  hero: {
    frameWidth: 1366,
    height: 455,
    bannerHeight: 392.25, // 49:178
    blockWidth: 414, // 50:222
    blockHeight: 395,
    blockTop: 60,
    blockGap: 30, // inner stack -> payments strip
    innerGap: 10, // heading / amount / subline / CTA
    ctaWidth: 312, // 55:562
    ctaHeight: 68,
    arrowSize: 32, // 107:3682
    arrowInset: 61,
    arrowTop: 215,
  },
  tablet: {
    gutter: 16,
    cardGap: 20,
    cardWidth: 358, // 70:1292
    cardHeight: 236,
    textWidth: 152, // 68:1282
    textGap: 2,
    padding: 16,
    ctaHeight: 36, // 68:1272
    ctaPaddingHorizontal: 23,
    arrowSize: 24, // 70:1643
    arrowInset: 4,
    fadeWidth: 76, // 72:1304 — the scroll affordance over the trailing card
    dotWidth: 30, // 71:1303
    dotHeight: 5,
    dotGap: 14,
    dotRowHeight: 40, // 71:1297
  },
  phone: {
    gutter: 16,
    cardGap: 20,
    cardWidth: 288, // 96:5031
    cardHeight: 190,
    textWidth: 156, // 96:5023
    textGap: 2,
    padding: 16,
    ctaHeight: 30, // 96:5028
    ctaPaddingHorizontal: 12,
    // The phone frame draws no arrows — see the deviation note in PromoSlider.
    arrowSize: 24,
    arrowInset: 4,
    fadeWidth: 0,
    dotWidth: 6, // 96:5098
    dotHeight: 6,
    dotGap: 10,
    dotRowHeight: 16, // 96:5101
  },
  dotRadius: 3,
  // payments [1] vector 52:303. Scaled by width below $xl, so the ratio is what matters.
  paymentsWidth: 414,
  paymentsHeight: 22.476,
} as const

// Measured off laptop 55:829, tablet 76:1412, phone 98:5136. `tileSize` is the frame's tile, not
// the rendered one — the small frames' rows overflow (by 94 and 64) to signal the scroll, so tiles
// flex to the measured width instead. `*Font` keys are Tamagui steps, not measurements.
export const games = {
  laptop: {
    gutter: 74,
    columns: 5,
    columnGap: 17, // 46:52
    rowGap: 18,
    tileSize: 230,
    // 55:828 is 55 tall with 30 of bottom padding, so its 35-tall text overflows 5 above the frame.
    headingHeight: 55,
    headingPaddingBottom: 30,
    headerFont: '$7', // 55:830 is Rubik Bold 30/35 caps
    headerWeight: 'bold',
    // The page stacks its frames flush; the air above the title belongs to section 03 RATINGS,
    // which is out of scope, so its own 46 top padding stands in.
    sectionPaddingTop: 46,
    // The laptop frame heads the section with a title, not a counter row. Present as undefined so
    // the three sets share a shape, as `nav` does with `frameWidth`.
    headerHeight: undefined,
    headerGap: undefined,
    counterWidth: undefined,
    counterHeight: undefined,
    counterChipFont: undefined,
    counterHasGradient: false,
    badgeSize: 32, // 107:3803 — the Labels row is 32 tall, inset 8, gap 4
    badgeInset: 8,
    badgeGap: 4,
    badgePaddingHorizontal: 9,
    badgeBorderWidth: 2,
    hotRtpWidth: 100, // 107:3820 is a fixed 100 wide; below $xl the pill sizes to its text
    chipHeight: 22,
    badgeFont: '$4',
    labelFont: '$3',
    favouriteGlyph: 24,
    viewMoreGap: 36, // 56:840 — the 228x46 button sits 36 below the grid
    // 56:840 is 118 tall around a 46 button at y 36, so the section closes on the same 36.
    sectionPaddingBottom: 36,
  },
  tablet: {
    gutter: 16,
    columns: 5,
    columnGap: 20, // 81:1364
    rowGap: 20,
    tileSize: 150,
    headingHeight: undefined,
    headingPaddingBottom: 0,
    headerFont: '$4', // 80:1360 is Rubik Bold 16 caps
    headerWeight: 'bold',
    sectionPaddingTop: 20, // 80:1357
    headerHeight: 32,
    headerGap: 10, // header ends at 52, tiles start at 62
    counterWidth: 112, // 80:1348
    counterHeight: 32,
    counterChipFont: '$2', // 77:1418 is Rubik Medium 12 on the tablet frame
    counterHasGradient: true,
    badgeSize: 24,
    badgeInset: 6,
    badgeGap: 4,
    badgePaddingHorizontal: 7,
    badgeBorderWidth: 1.5,
    hotRtpWidth: undefined,
    chipHeight: 18,
    badgeFont: '$2',
    labelFont: '$2',
    favouriteGlyph: 18,
    viewMoreGap: 24,
    // 76:1412 is 232 around 212 of content.
    sectionPaddingBottom: 20,
  },
  phone: {
    gutter: 16,
    columns: 3,
    columnGap: 16, // 98:5147
    rowGap: 16,
    tileSize: 120,
    headingHeight: undefined,
    headingPaddingBottom: 0,
    headerFont: '$3', // 98:5142 is Rubik SemiBold 14 caps
    headerWeight: 'semibold',
    sectionPaddingTop: 20, // 98:5137
    headerHeight: 32,
    headerGap: 10,
    // The phone counter drops the tablet's violet gradient and keeps only the blue chip.
    counterWidth: 91, // 98:5144
    counterHeight: 26,
    // 98:5144's chip is Rubik Regular 14. We ship no Regular face, so the step's Medium stands in.
    counterChipFont: '$3',
    counterHasGradient: false,
    badgeSize: 20,
    badgeInset: 5,
    badgeGap: 3,
    badgePaddingHorizontal: 6,
    badgeBorderWidth: 1,
    hotRtpWidth: undefined,
    chipHeight: 15,
    badgeFont: '$1',
    labelFont: '$1',
    favouriteGlyph: 15,
    viewMoreGap: 20,
    // 98:5136, same shape as the tablet frame.
    sectionPaddingBottom: 20,
  },
  // Shared across breakpoints.
  frameWidth: 1366, // the laptop frame; above it the section centres, as the header does
  tileRadius: 6, // 107:3940
  counterChipHeight: 20, // 77:1417
  counterChipPaddingHorizontal: 3,
  counterGap: 10,
  counterPaddingHorizontal: 9,
  viewMoreWidth: 228, // 56:840
  viewMoreHeight: 46,
} as const
