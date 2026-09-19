import type { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware'

import type { PersistedUserState } from './types'

type Stored = StorageValue<PersistedUserState>

// A corrupt payload must read as "nothing stored", not throw: zustand fires its finish listeners
// only on the success path, so a throw pins hasHydrated false forever. createJSONStorage parses
// where we cannot guard it, hence our own JSON handling.
function parse(raw: string | null): Stored | null {
  if (raw === null) return null

  try {
    return JSON.parse(raw) as Stored
  } catch {
    return null
  }
}

// persist writes on every set, so balance ticks would hit disk without changing the persisted
// slice. Dedupe by payload, and swallow write failures so a full quota cannot break a press.
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

      // Synchronous for localStorage — awaiting would flash the signed-out header on every load.
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
