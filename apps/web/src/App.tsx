import { TokenSwatches, tamaguiConfig } from '@duxcasino/shared-ui'
import { TamaguiProvider } from 'tamagui'

export function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <TokenSwatches />
    </TamaguiProvider>
  )
}
