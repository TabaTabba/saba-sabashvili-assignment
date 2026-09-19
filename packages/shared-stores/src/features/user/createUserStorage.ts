import type { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware'

import type { PersistedUserState } from './types'

type Stored = StorageValue<PersistedUserState>

// A corrupt payload has to read as "nothing stored", not throw: zustand's hydrate() fires its
// finish listeners only on the success path, so a throw in here pins hasHydrated false forever and
// the nav never leaves its pre-hydration state. createJSONStorage parses outside this function,
// where we cannot guard it, which is why the JSON handling is ours.
function parse(raw: string | null): Stored | null {
  if (raw === null) return null

  try {
    return JSON.parse(raw) as Stored
  } catch {
    return null
  }
}

// persist re-serialises and writes on every set, so balance ticks would hit disk even though they
// never change the persisted slice. Dedupe by payload and swallow write failures — a full quota or
// Safari private mode must not take down a press handler.
export function createUserStorage(backend: StateStorage): PersistStorage<PersistedUserState> {
  let lastWritten: string | null = null

  return {
    getItem: name => {
      let raw: string | null | Promise<string | null>

      try {
        raw = backend.getItem(name)
      } catch {
        return null
      }

      // Stays synchronous for localStorage — awaiting here would hydrate a tick late and flash the
      // signed-out header on every web load.
      return raw instanceof Promise ? raw.then(parse, () => null) : parse(raw)
    },

    setItem: async (name, value) => {
      const raw = JSON.stringify(value)
      if (raw === lastWritten) return

      try {
        await backend.setItem(name, raw)
        lastWritten = raw
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
  }
}
