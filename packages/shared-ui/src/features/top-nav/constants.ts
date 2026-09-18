import type { GameCategory } from '@duxcasino/shared-api'
import type { Language } from '@duxcasino/shared-stores'

export const NAV_LINKS = ['Live', 'Promotions', 'VIP', 'Dux boxes', 'Path do rewards'] as const

export const HAIRLINE = 1

export const PANEL = {
  gap: 8,
  minWidth: 160,
  zIndex: 20,
} as const

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  all: 'All games',
  top: 'Top',
  'hot-rtp': 'Hot RTP',
  new: 'New',
  live: 'Live',
  money: 'Money',
  jackpot: 'Jackpot',
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
}

export const LANGUAGE_LOCALES: Record<Language, string> = {
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
}
