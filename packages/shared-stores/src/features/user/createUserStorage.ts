import { createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

import type { PersistedUserState } from './types'

// persist re-serialises and writes on every set, so balance ticks would hit disk even though they
// never change the persisted slice. Dedupe by payload and swallow write failures — a full quota or
// Safari private mode must not take down a press handler.
export function createUserStorage(backend: StateStorage) {
  let lastWritten: string | null = null

  return createJSONStorage<PersistedUserState>(() => ({
    getItem: name => backend.getItem(name),

    setItem: async (name, value) => {
      if (value === lastWritten) return
      try {
        await backend.setItem(name, value)
        lastWritten = value
      } catch {
        lastWritten = null
      }
    },

    removeItem: async name => {
      lastWritten = null
      try {
        await backend.removeItem(name)
      } catch {
        // Unhandled otherwise — zustand's clearStorage() calls removeItem without await or catch.
      }
    },
  }))
}
