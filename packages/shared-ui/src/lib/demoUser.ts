import type { User } from '@duxcasino/shared-stores'

// There is no auth in this build. Both the header's Login/Sign up pair and the promo CTAs sign in
// as this one account, which is what makes the balance, refresh and persistence states reachable.
export const DEMO_USER: User = {
  id: 'u_1',
  username: 'LuckyDux',
  avatarUrl: '',
  currency: 'EUR',
}
