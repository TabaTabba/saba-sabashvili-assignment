export interface User {
  id: string
  username: string
  avatarUrl: string
  currency: string
}

export type BalanceStatus = 'idle' | 'loading' | 'success' | 'error'

export const LANGUAGES = ['en', 'de', 'fr', 'it'] as const

export type Language = (typeof LANGUAGES)[number]

export interface UserState {
  user: User | null
  balance: number | null
  balanceStatus: BalanceStatus
  balanceError: string | null
  /** Bumped by refreshBalance(). The balance query watches it and refetches. */
  refreshToken: number
  language: Language
  /** False until persist has read storage. AsyncStorage resolves a tick after first render, so
   *  native briefly reports a signed-out user that is not really signed out. */
  hasHydrated: boolean

  signIn: (user: User) => void
  signOut: () => void
  refreshBalance: () => void
  setLanguage: (language: Language) => void
  setBalanceLoading: (userId: string) => void
  setBalanceSuccess: (userId: string, balance: number) => void
  setBalanceError: (userId: string, message: string) => void
}

export type PersistedUserState = Pick<UserState, 'user' | 'language'>
