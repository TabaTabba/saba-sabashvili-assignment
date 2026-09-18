import type { GameCategory } from '@duxcasino/shared-api'

// In lib/ because the nav and the games header both read it and may not import each other.
export const CATEGORY_LABELS: Record<GameCategory, string> = {
  all: 'All games',
  top: 'Top',
  'hot-rtp': 'Hot RTP',
  new: 'New',
  live: 'Live',
  money: 'Money',
  jackpot: 'Jackpot',
}
