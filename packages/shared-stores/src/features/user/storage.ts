import type { StateStorage } from 'zustand/middleware'

import { createUserStorage } from './createUserStorage'

// Node fallback, used by Vitest. Vite resolves storage.web.ts and Metro storage.native.ts ahead of
// this file, so it never ships to either app.
const memory = new Map<string, string>()

const memoryBackend: StateStorage = {
  getItem: name => memory.get(name) ?? null,
  setItem: (name, value) => {
    memory.set(name, value)
  },
  removeItem: name => {
    memory.delete(name)
  },
}

export const userStorage = createUserStorage(memoryBackend)
