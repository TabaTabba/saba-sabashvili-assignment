import { createQueryClient } from '@duxcasino/shared-api'
import type { GameCategory } from '@duxcasino/shared-api'
import { PopularGames, PromoSlider, TopNav, tamaguiConfig } from '@duxcasino/shared-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { TamaguiProvider, YStack } from 'tamagui'

export function App() {
  const [queryClient] = useState(createQueryClient)
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all')

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <YStack backgroundColor="$background" minHeight="100%">
          <TopNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
          <PromoSlider />
          <PopularGames category={activeCategory} />
        </YStack>
      </TamaguiProvider>
    </QueryClientProvider>
  )
}
