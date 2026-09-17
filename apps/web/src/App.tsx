import { tamaguiConfig } from '@duxcasino/shared-ui'
import { TamaguiProvider, Text, YStack } from 'tamagui'

export function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <YStack
        flex={1}
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        backgroundColor="$background"
      >
        <Text color="$color">DuxCasino web — scaffold</Text>
      </YStack>
    </TamaguiProvider>
  )
}
