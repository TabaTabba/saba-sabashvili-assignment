// Tamagui's LinearGradient paints its gradient as an absolutely positioned child, so anything
// inside one renders underneath unless it is positioned too. Spread this onto the label.
export const aboveGradient = {
  position: 'relative',
  zIndex: 1,
} as const
