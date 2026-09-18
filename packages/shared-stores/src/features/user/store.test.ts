import { beforeEach, describe, expect, it } from 'vitest'
import { createJSONStorage } from 'zustand/middleware'

import { useUserStore } from './store'
import type { PersistedUserState, User } from './types'

const alice: User = {
  id: 'u_alice',
  username: 'alice',
  avatarUrl: 'https://example.test/a.png',
  currency: 'EUR',
}

const bob: User = {
  id: 'u_bob',
  username: 'bob',
  avatarUrl: 'https://example.test/b.png',
  currency: 'EUR',
}

// Captured before any test mutates it, so adding a field to the store cannot leave reset() stale.
const pristine = useUserStore.getState()

function reset() {
  useUserStore.setState(pristine, true)
}

describe('useUserStore', () => {
  beforeEach(reset)

  it('starts signed out with an idle balance', () => {
    expect(pristine.user).toBeNull()
    expect(pristine.balance).toBeNull()
    expect(pristine.balanceStatus).toBe('idle')
    expect(pristine.refreshToken).toBe(0)
  })

  it('signs a user in and out', () => {
    useUserStore.getState().signIn(alice)
    expect(useUserStore.getState().user).toEqual(alice)

    useUserStore.getState().signOut()
    expect(useUserStore.getState().user).toBeNull()
  })

  it('clears the balance on sign out', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().setBalanceSuccess(alice.id, 1234.5)
    useUserStore.getState().signOut()

    expect(useUserStore.getState().balance).toBeNull()
    expect(useUserStore.getState().balanceStatus).toBe('idle')
  })

  it('clears the balance when a different user signs in', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().setBalanceSuccess(alice.id, 1234.5)
    useUserStore.getState().signIn(bob)

    expect(useUserStore.getState().user).toEqual(bob)
    expect(useUserStore.getState().balance).toBeNull()
  })

  it('discards a balance response that outlived its user', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().signIn(bob)

    // Alice's request resolves after the switch.
    useUserStore.getState().setBalanceSuccess(alice.id, 9999)

    expect(useUserStore.getState().balance).toBeNull()
    expect(useUserStore.getState().balanceStatus).toBe('idle')
  })

  it('discards a stale error too', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().signIn(bob)
    useUserStore.getState().setBalanceError(alice.id, 'alice failed')

    expect(useUserStore.getState().balanceStatus).toBe('idle')
    expect(useUserStore.getState().balanceError).toBeNull()
  })

  it('moves through loading to success', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().setBalanceLoading(alice.id)
    expect(useUserStore.getState().balanceStatus).toBe('loading')

    useUserStore.getState().setBalanceSuccess(alice.id, 980.25)
    expect(useUserStore.getState().balance).toBe(980.25)
    expect(useUserStore.getState().balanceStatus).toBe('success')
    expect(useUserStore.getState().balanceError).toBeNull()
  })

  it('keeps the last known balance when a refresh fails', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().setBalanceSuccess(alice.id, 500)
    useUserStore.getState().setBalanceError(alice.id, 'Network unreachable')

    expect(useUserStore.getState().balanceStatus).toBe('error')
    expect(useUserStore.getState().balanceError).toBe('Network unreachable')
    expect(useUserStore.getState().balance).toBe(500)
  })

  it('clears a previous error when a refresh starts', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().setBalanceError(alice.id, 'boom')
    useUserStore.getState().setBalanceLoading(alice.id)
    expect(useUserStore.getState().balanceError).toBeNull()
  })

  it('bumps refreshToken so the balance query can watch it', () => {
    useUserStore.getState().refreshBalance()
    useUserStore.getState().refreshBalance()
    expect(useUserStore.getState().refreshToken).toBe(2)
  })
})

describe('persistence', () => {
  beforeEach(reset)

  // Partial so a v1 payload — which had no language — can be seeded to exercise the migration.
  function seedStorage(value: Partial<PersistedUserState> | null) {
    // Reset before installing the storage: setState goes through persist and would write the
    // current (empty) user straight over the seed.
    useUserStore.setState({ hasHydrated: false })

    const entries = new Map<string, string>()
    if (value) {
      entries.set('duxcasino.user', JSON.stringify({ state: value, version: 1 }))
    }
    useUserStore.persist.setOptions({
      storage: createJSONStorage<PersistedUserState>(() => ({
        getItem: name => entries.get(name) ?? null,
        setItem: (name, next) => {
          entries.set(name, next)
        },
        removeItem: name => {
          entries.delete(name)
        },
      })),
    })
    return entries
  }

  it('restores a persisted user on rehydrate', async () => {
    seedStorage({ user: alice, language: 'en' })
    await useUserStore.persist.rehydrate()

    expect(useUserStore.getState().user).toEqual(alice)
    expect(useUserStore.getState().hasHydrated).toBe(true)
  })

  it('writes the user to storage and never the balance', async () => {
    const entries = seedStorage(null)

    useUserStore.getState().signIn(alice)
    useUserStore.getState().setBalanceSuccess(alice.id, 42)
    await Promise.resolve()

    const written = entries.get('duxcasino.user')
    expect(written).toBeDefined()
    expect(JSON.parse(written ?? '{}').state).toEqual({ user: alice, language: 'en' })
  })

  it('rehydrating an empty store leaves it signed out but hydrated', async () => {
    seedStorage(null)
    await useUserStore.persist.rehydrate()

    expect(useUserStore.getState().user).toBeNull()
    expect(useUserStore.getState().hasHydrated).toBe(true)
  })

  it('writes the language to storage', async () => {
    const entries = seedStorage(null)

    useUserStore.getState().setLanguage('de')
    await Promise.resolve()

    expect(JSON.parse(entries.get('duxcasino.user') ?? '{}').state.language).toBe('de')
  })

  it('restores a persisted language on rehydrate', async () => {
    seedStorage({ user: null, language: 'it' })
    await useUserStore.persist.rehydrate()

    expect(useUserStore.getState().language).toBe('it')
  })

  it('drops a persisted user that does not match the current shape', async () => {
    // A half-written or foreign payload used to be cast straight through, and a component reading
    // user.username would throw on it.
    seedStorage({ user: { id: 'u_1' } } as unknown as Partial<PersistedUserState>)
    await useUserStore.persist.rehydrate()

    expect(useUserStore.getState().user).toBeNull()
    expect(useUserStore.getState().hasHydrated).toBe(true)
  })

  it('falls back to the default language when the persisted one is unknown', async () => {
    seedStorage({ language: 'xx' } as unknown as Partial<PersistedUserState>)
    await useUserStore.persist.rehydrate()

    expect(useUserStore.getState().language).toBe('en')
  })

  it('migrates a v1 payload by keeping its user and defaulting the language', async () => {
    seedStorage({ user: alice })
    await useUserStore.persist.rehydrate()

    expect(useUserStore.getState().user).toEqual(alice)
    expect(useUserStore.getState().language).toBe('en')
  })

  it('keeps the language across sign out', () => {
    useUserStore.getState().signIn(alice)
    useUserStore.getState().setLanguage('fr')
    useUserStore.getState().signOut()

    expect(useUserStore.getState().user).toBeNull()
    expect(useUserStore.getState().language).toBe('fr')
  })
})
