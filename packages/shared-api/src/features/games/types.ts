export const GAME_CATEGORIES = ['all', 'top', 'hot-rtp', 'new', 'live', 'money', 'jackpot'] as const

export type GameCategory = (typeof GAME_CATEGORIES)[number]

export interface GameBadges {
  hotRtp: boolean
  flame: boolean
  lines: number | null
}

export interface Game {
  id: string
  name: string
  provider: string
  category: Exclude<GameCategory, 'all'>
  badges: GameBadges
  isFavourite: boolean
}

export interface GamesPage {
  games: Game[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface GamesQuery {
  category: GameCategory
  page: number
  pageSize: number
}
