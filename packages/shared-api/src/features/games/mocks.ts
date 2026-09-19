import { failIfFaulty, isFaultActive } from '../../lib/faults'
import { latency } from '../../lib/latency'
import type { Game, GameCategory, GamesPage, GamesQuery } from './types'

const NAMES = [
  'Book of Gold',
  'Buffalo King',
  'Gates of Olympus',
  'Hit Bar Gold',
  '888 Dragons',
  'Mustang Trail',
  'Starlight Princess',
  'Legacy of Dead',
  'Sweet Bonanza',
  'Sugar Rush',
  'Wolf Gold',
  'Big Bass Splash',
  'Money Train',
  'Dead or Alive',
  'Fire Joker',
  'Reactoonz',
  'Jammin Jars',
  'Razor Shark',
  'Gonzo Quest',
  'Immortal Romance',
]

const PROVIDERS = ['Amatic', "Play'n GO", 'Pragmatic Play', 'Push Gaming', 'Relax', 'Spinomenal']
const CATEGORIES: Exclude<GameCategory, 'all'>[] = [
  'top',
  'hot-rtp',
  'new',
  'live',
  'money',
  'jackpot',
]
const LINE_COUNTS = [10, 20, 25, 40, 243]

const PER_CATEGORY = 12
const TOTAL_GAMES = CATEGORIES.length * PER_CATEGORY

function noise(index: number, salt: number) {
  const value = Math.sin((index + 1) * salt) * 10_000
  return value - Math.floor(value)
}

function at<T>(list: readonly T[], index: number): T {
  const value = list[index % list.length]
  if (value === undefined) throw new Error('at() called on an empty list')
  return value
}

function buildGame(index: number): Game {
  const category = at(CATEGORIES, index)
  const nameIndex = Math.floor(noise(index, 91.7) * NAMES.length)
  const round = Math.floor(index / NAMES.length)

  return {
    id: `game_${index + 1}`,
    name: round > 0 ? `${at(NAMES, nameIndex)} ${round + 1}` : at(NAMES, nameIndex),
    provider: at(PROVIDERS, Math.floor(index / CATEGORIES.length)),
    category,
    badges: {
      hotRtp: category === 'hot-rtp' || noise(index, 12.9898) < 0.3,
      flame: category === 'top' || noise(index, 78.233) < 0.25,
      lines: noise(index, 43.758) < 0.5 ? at(LINE_COUNTS, index) : null,
    },
    isFavourite: false,
  }
}

const ALL_GAMES: Game[] = Array.from({ length: TOTAL_GAMES }, (_, index) => buildGame(index))

function copy(game: Game): Game {
  return { ...game, badges: { ...game.badges } }
}

export async function fetchGames({ category, page, pageSize }: GamesQuery): Promise<GamesPage> {
  await latency()
  failIfFaulty('games', 'Could not load games')

  // Every category holds 12 games, so the grid's empty state is otherwise unreachable.
  const matching = isFaultActive('gamesEmpty')
    ? []
    : category === 'all'
      ? ALL_GAMES
      : ALL_GAMES.filter(g => g.category === category)
  const start = page * pageSize

  return {
    games: matching.slice(start, start + pageSize).map(copy),
    category,
    page,
    pageSize,
    total: matching.length,
    hasMore: start + pageSize < matching.length,
  }
}

export async function setGameFavourite(gameId: string, isFavourite: boolean): Promise<Game> {
  await latency()
  failIfFaulty('favourite', 'Could not save your favourite')

  const game = ALL_GAMES.find(candidate => candidate.id === gameId)
  if (!game) throw new Error(`Unknown game ${gameId}`)

  game.isFavourite = isFavourite
  return copy(game)
}

export function resetGamesMock() {
  for (const game of ALL_GAMES) game.isFavourite = false
}
