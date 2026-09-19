import type { User } from '@duxcasino/shared-stores'

// No auth in this build — the header pair and the promo CTAs all sign in as this one account.
export const DEMO_USER: User = {
  id: 'u_1',
  username: 'LuckyDux',
  avatarUrl: '',
  currency: 'EUR',
}
