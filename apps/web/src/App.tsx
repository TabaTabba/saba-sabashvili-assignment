import { createQueryClient } from '@duxcasino/shared-api'
import { TokenSwatches, tamaguiConfig } from '@duxcasino/shared-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { TamaguiProvider } from 'tamagui'

export function App() {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <TokenSwatches />
      </TamaguiProvider>
    </QueryClientProvider>
  )
}
