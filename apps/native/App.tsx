import { createQueryClient } from '@duxcasino/shared-api'
import type { GameCategory } from '@duxcasino/shared-api'
import { PromoSlider, TokenSwatches, TopNav, tamaguiConfig } from '@duxcasino/shared-ui'
import {
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  useFonts,
} from '@expo-google-fonts/rubik'
import '@tamagui/native/setup-expo-linear-gradient'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TamaguiProvider, YStack } from 'tamagui'

interface AppShellProps {
  activeCategory: GameCategory
  onSelectCategory: (category: GameCategory) => void
}

function AppShell({ activeCategory, onSelectCategory }: AppShellProps) {
  const insets = useSafeAreaInsets()
  const [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  })

  if (!fontsLoaded) {
    // Rendering before the faces load shows fallback metrics, so hold the frame.
    return <YStack flex={1} backgroundColor="$background" />
  }

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <TopNav activeCategory={activeCategory} onSelectCategory={onSelectCategory} />
      <PromoSlider />
      <TokenSwatches />
    </YStack>
  )
}

export function App() {
  const [queryClient] = useState(createQueryClient)
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all')

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AppShell activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        </SafeAreaProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  )
}
