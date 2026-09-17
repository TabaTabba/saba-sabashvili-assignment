import { tamaguiConfig } from '@duxcasino/shared-ui'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider, Text, YStack } from 'tamagui'

export function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <SafeAreaProvider>
        <StatusBar style="light" />
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
          <Text color="$color">DuxCasino native — scaffold</Text>
        </YStack>
      </SafeAreaProvider>
    </TamaguiProvider>
  )
}
