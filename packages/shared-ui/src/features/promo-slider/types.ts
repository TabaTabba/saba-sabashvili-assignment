import type { promo } from '../../theme/tokens'

// The tablet and phone frames draw the same card at different sizes, so their geometry shares a
// key shape and one lookup picks either. The laptop frame draws a hero banner instead.
export type PromoCardGeometry = typeof promo.tablet | typeof promo.phone
