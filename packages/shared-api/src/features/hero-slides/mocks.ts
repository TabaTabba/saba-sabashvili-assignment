import { failIfFaulty } from '../../lib/faults'
import { latency } from '../../lib/latency'
import type { HeroSlide } from './types'

const SLIDES: HeroSlide[] = [
  {
    id: 'welcome',
    heading: 'Welcome package',
    amount: '€1500',
    subline: '+ 150 free spins on your first four deposits',
    ctaLabel: 'Get bonus',
    imageUrl: 'https://picsum.photos/seed/duxcasino-welcome/1366/392',
  },
  {
    id: 'weekend',
    heading: 'Weekend reload',
    amount: '50%',
    subline: 'Up to €300 every Friday through Sunday',
    ctaLabel: 'Claim reload',
    imageUrl: 'https://picsum.photos/seed/duxcasino-weekend/1366/392',
  },
  {
    id: 'cashback',
    heading: 'Live cashback',
    amount: '€500',
    subline: '10% back on live tables, paid every Monday',
    ctaLabel: 'Play live',
    imageUrl: 'https://picsum.photos/seed/duxcasino-cashback/1366/392',
  },
  {
    id: 'dux-boxes',
    heading: 'Dux boxes',
    amount: '×3',
    subline: 'Open a box for every 1000 points you collect',
    ctaLabel: 'Open a box',
    imageUrl: 'https://picsum.photos/seed/duxcasino-boxes/1366/392',
  },
]

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  await latency()
  failIfFaulty('heroSlides', 'Could not load promotions')
  return SLIDES
}
