import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { userStorage } from './storage'
import { LANGUAGES } from './types'
import type { Language, PersistedUserState, User, UserState } from './types'

const STORAGE_KEY = 'duxcasino.user'

const DEFAULT_LANGUAGE: Language = 'en'

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<keyof User, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.username === 'string' &&
    typeof candidate.avatarUrl === 'string' &&
    typeof candidate.currency === 'string'
  )
}

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language)
}

function parsePersisted(value: unknown): PersistedUserState {
  const persisted =
    typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}

  return {
    user: isUser(persisted.user) ? persisted.user : null,
    language: isLanguage(persisted.language) ? persisted.language : DEFAULT_LANGUAGE,
  }
}

const SIGNED_OUT = {
  user: null,
  balance: null,
  balanceStatus: 'idle',
  balanceError: null,
} as const

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      // A balance request that resolves after the user changed must not write into the new session.
      const ifCurrent = (userId: string, patch: Partial<UserState>) =>
        set(get().user?.id === userId ? patch : {})

      return {
        ...SIGNED_OUT,
        language: DEFAULT_LANGUAGE,
        refreshToken: 0,
        hasHydrated: false,

        signIn: (user: User) => set({ ...SIGNED_OUT, user }),
        signOut: () => set({ ...SIGNED_OUT }),
        refreshBalance: () => set(state => ({ refreshToken: state.refreshToken + 1 })),

        setLanguage: (language: Language) => set({ language }),

        setBalanceLoading: (userId: string) =>
          ifCurrent(userId, { balanceStatus: 'loading', balanceError: null }),

        setBalanceSuccess: (userId: string, balance: number) =>
          ifCurrent(userId, { balance, balanceStatus: 'success', balanceError: null }),

        setBalanceError: (userId: string, message: string) =>
          ifCurrent(userId, { balanceStatus: 'error', balanceError: message }),
      }
    },
    {
      name: STORAGE_KEY,
      version: 2,
      storage: userStorage,
      partialize: (state): PersistedUserState => ({ user: state.user, language: state.language }),
      // Without this a version bump throws inside persist and leaves the app unhydrated rather
      // than merely signed out. A v1 payload keeps its user and picks up the default language.
      migrate: parsePersisted,
      // migrate only runs on a version change, so the same parse guards every other load too.
      merge: (persisted, current) => ({ ...current, ...parsePersisted(persisted) }),
    },
  ),
)

// Wired after create, not via onRehydrateStorage: localStorage hydrates synchronously inside
// create(), so a callback referencing useUserStore there hits the temporal dead zone.
const markHydrated = () => useUserStore.setState({ hasHydrated: true })

useUserStore.persist.onFinishHydration(markHydrated)

if (useUserStore.persist.hasHydrated()) {
  markHydrated()
}
