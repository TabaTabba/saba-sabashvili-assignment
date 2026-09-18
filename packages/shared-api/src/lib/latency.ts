const MIN_MS = 400
const MAX_MS = 800

export function latency(): Promise<void> {
  const ms = MIN_MS + Math.random() * (MAX_MS - MIN_MS)
  return new Promise(resolve => setTimeout(resolve, ms))
}
