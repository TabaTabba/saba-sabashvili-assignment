import type { games } from '../../theme/tokens'

// One set per design frame; they share a key shape so one `useMedia()` lookup picks any of them.
export type GamesGeometry = typeof games.laptop | typeof games.tablet | typeof games.phone
