// Failures on demand, so the error, empty and rollback states are demonstrable rather than
// luck-dependent. Nothing in the UI toggles them — `applyFaultsFromQuery` below is the way in.
const FAULT_KEYS = ['balance', 'heroSlides', 'games', 'gamesEmpty', 'favourite'] as const

type FaultKey = (typeof FAULT_KEYS)[number]

const active = new Set<FaultKey>()

export function setFault(key: FaultKey, enabled: boolean) {
  if (enabled) active.add(key)
  else active.delete(key)
}

export function isFaultActive(key: FaultKey) {
  return active.has(key)
}

export function failIfFaulty(key: FaultKey, message: string) {
  if (active.has(key)) throw new Error(message)
}

export function clearFaults() {
  active.clear()
}

// `?fault=games,balance` arms those keys before the first render. Web only: the native app has no
// query string, and a deep-link parser would mean a dependency for a debug flag.
export function applyFaultsFromQuery(search: string) {
  const requested = new URLSearchParams(search).get('fault')?.split(',') ?? []
  for (const key of FAULT_KEYS) {
    if (requested.includes(key)) setFault(key, true)
  }
}
