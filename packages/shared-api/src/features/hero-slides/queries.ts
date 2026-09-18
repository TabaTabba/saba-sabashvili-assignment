import { useQuery } from '@tanstack/react-query'

import { fetchHeroSlides } from './mocks'

export const heroSlideKeys = {
  all: ['heroSlides'] as const,
}

const FIVE_MINUTES = 300_000

export function useHeroSlides() {
  return useQuery({
    queryKey: heroSlideKeys.all,
    queryFn: fetchHeroSlides,
    // Promotions are static mock data; there is nothing to go stale.
    staleTime: FIVE_MINUTES,
  })
}
