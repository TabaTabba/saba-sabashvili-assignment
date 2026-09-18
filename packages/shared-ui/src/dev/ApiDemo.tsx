import { setFault, useGames, useHeroSlides, useUserBalance } from '@duxcasino/shared-api'
import { useUserStore } from '@duxcasino/shared-stores'
import { useState } from 'react'
import { Button, Text, XStack, YStack } from 'tamagui'

const LABEL_WIDTH = 120
const HAIRLINE = 1

interface RowProps {
  label: string
  value: string
}

function Row({ label, value }: RowProps) {
  return (
    <XStack gap="$4" alignItems="center">
      <Text fontSize="$2" color="$colorMuted" width={LABEL_WIDTH}>
        {label}
      </Text>
      <Text fontSize="$3" color="$color">
        {value}
      </Text>
    </XStack>
  )
}

function describe(status: string, error: Error | null, detail: string) {
  if (status === 'pending') return 'loading…'
  if (error) return `error: ${error.message}`
  return detail
}

export function ApiDemo() {
  const user = useUserStore(state => state.user)
  const refreshBalance = useUserStore(state => state.refreshBalance)
  const [failing, setFailing] = useState(false)

  const balance = useUserBalance()
  const slides = useHeroSlides()
  const games = useGames('all')

  const loadedGames = games.data?.pages.flatMap(page => page.games).length ?? 0
  const total = games.data?.pages[0]?.total ?? 0

  function toggleFaults() {
    const next = !failing
    setFailing(next)
    setFault('balance', next)
    setFault('heroSlides', next)
    setFault('games', next)
  }

  return (
    <YStack
      gap="$4"
      padding="$5"
      backgroundColor="$surface"
      borderRadius="$3"
      borderWidth={HAIRLINE}
      borderColor="$borderColor"
    >
      <Text fontSize="$5" color="$color">
        API hooks
      </Text>

      <YStack gap="$2">
        <Row
          label="query balance"
          value={
            user
              ? describe(balance.status, balance.error, balance.data?.amount.toFixed(2) ?? '—')
              : 'disabled (signed out)'
          }
        />
        <Row
          label="query slides"
          value={describe(slides.status, slides.error, `${slides.data?.length ?? 0} slides`)}
        />
        <Row
          label="query games"
          value={describe(games.status, games.error, `${loadedGames} of ${total} loaded`)}
        />
      </YStack>

      <XStack gap="$2" flexWrap="wrap">
        <Button size="$3" onPress={refreshBalance} disabled={!user}>
          Refresh balance
        </Button>
        <Button
          size="$3"
          onPress={() => games.fetchNextPage()}
          disabled={!games.hasNextPage || games.isFetchingNextPage}
        >
          View more games
        </Button>
        <Button size="$3" onPress={toggleFaults}>
          {failing ? 'Faults on' : 'Faults off'}
        </Button>
      </XStack>

      <Text fontSize="$2" color="$colorMuted">
        Sign in above to enable the balance query. Faults force every request to fail.
      </Text>
    </YStack>
  )
}
