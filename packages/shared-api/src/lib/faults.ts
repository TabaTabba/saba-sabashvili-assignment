export type FaultKey = 'balance' | 'heroSlides' | 'games' | 'favourite'

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
