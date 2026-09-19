import type { promo } from '../../theme/tokens'

// Tablet and phone share a key shape, so one lookup picks either. The laptop draws a hero instead.
export type PromoCardGeometry = typeof promo.tablet | typeof promo.phone
