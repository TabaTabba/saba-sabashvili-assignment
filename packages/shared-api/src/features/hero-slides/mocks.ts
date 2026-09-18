import { failIfFaulty } from '../../lib/faults'
import { latency } from '../../lib/latency'
import type { HeroSlide } from './types'

// Copy is kept short on purpose: the hero renders `amount` at 112px inside a 414px block, and the
// promo card renders `heading`/`subline` in a 152px column. Longer strings wrap and break both.
const SLIDES: HeroSlide[] = [
  {
    id: 'welcome',
    heading: 'Welcome package',
    amount: '€500',
    subline: '+150 free spins',
    ctaLabel: 'Join now',
    imageUrl: 'https://picsum.photos/seed/duxcasino-welcome/1366/392',
  },
  {
    id: 'dux-boxes',
    heading: 'Dux boxes',
    amount: '×3',
    subline: 'Full of prizes',
    ctaLabel: 'Get bonus',
    imageUrl: 'https://picsum.photos/seed/duxcasino-boxes/1366/392',
  },
  {
    id: 'weekend',
    heading: 'Weekend reload',
    amount: '50%',
    subline: 'Up to €300 weekly',
    ctaLabel: 'Claim reload',
    imageUrl: 'https://picsum.photos/seed/duxcasino-weekend/1366/392',
  },
  {
    id: 'cashback',
    heading: 'Live cashback',
    amount: '€300',
    subline: '10% back weekly',
    ctaLabel: 'Play live',
    imageUrl: 'https://picsum.photos/seed/duxcasino-cashback/1366/392',
  },
]

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  await latency()
  failIfFaulty('heroSlides', 'Could not load promotions')
  return SLIDES.map(slide => ({ ...slide }))
}
