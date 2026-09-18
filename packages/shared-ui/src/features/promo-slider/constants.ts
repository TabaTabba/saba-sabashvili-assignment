export const AUTOPLAY_MS = 5000

// The design has no loading or failure state for this section; both are built from its own
// vocabulary — the card's surface colour and its 12px corner.
export const SKELETON_PULSE_MS = 700
export const SKELETON_DIM = 0.45

// The design's card artwork is a cutout that blends into the card. Mock artwork is a photograph
// with a hard edge, so this gradient stands in for the blend. It lives here rather than in
// theme/tokens.ts because `promo` there is measured Figma geometry and this is ours.
export const ARTWORK_FADE_WIDTH = 72
