import { TokenSwatches, tamaguiConfig } from '@duxcasino/shared-ui'
import {
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  useFonts,
} from '@expo-google-fonts/rubik'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TamaguiProvider, YStack } from 'tamagui'

function AppShell() {
  const insets = useSafeAreaInsets()
  const [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  })

  return (
    <YStack flex={1} backgroundColor="$background">
      {fontsLoaded ? <TokenSwatches topInset={insets.top} /> : null}
    </YStack>
  )
}

export function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppShell />
      </SafeAreaProvider>
    </TamaguiProvider>
  )
}
