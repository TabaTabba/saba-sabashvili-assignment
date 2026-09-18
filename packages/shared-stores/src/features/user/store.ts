import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { userStorage } from './storage'
import type { PersistedUserState, User, UserState } from './types'

const STORAGE_KEY = 'duxcasino.user'

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
        refreshToken: 0,
        hasHydrated: false,

        signIn: (user: User) => set({ ...SIGNED_OUT, user }),
        signOut: () => set({ ...SIGNED_OUT }),
        refreshBalance: () => set(state => ({ refreshToken: state.refreshToken + 1 })),

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
      version: 1,
      storage: userStorage,
      // Only the identity survives a reload — balance is refetched, and a stale number on screen
      // would be worse than none.
      partialize: (state): PersistedUserState => ({ user: state.user }),
      // Without this a future version bump throws inside persist, and the catch leaves the app
      // permanently unhydrated rather than merely signed out.
      migrate: () => ({ user: null }),
    },
  ),
)

// Wired after create, not via onRehydrateStorage: localStorage hydrates synchronously inside
// create(), so a callback referencing useUserStore there hits the temporal dead zone and persist
// swallows the error. Web is already hydrated by this line; native finishes a tick later.
const markHydrated = () => useUserStore.setState({ hasHydrated: true })

useUserStore.persist.onFinishHydration(markHydrated)

if (useUserStore.persist.hasHydrated()) {
  markHydrated()
}
