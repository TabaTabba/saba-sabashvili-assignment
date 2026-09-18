import { useUserStore } from '@duxcasino/shared-stores'
import type { User } from '@duxcasino/shared-stores'
import { Button, Text, XStack, YStack } from 'tamagui'

const MOCK_USER: User = {
  id: 'u_1',
  username: 'LuckyDux',
  avatarUrl: 'https://example.test/avatar.png',
  currency: 'EUR',
}

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

export function StoreDemo() {
  const user = useUserStore(state => state.user)
  const balance = useUserStore(state => state.balance)
  const balanceStatus = useUserStore(state => state.balanceStatus)
  const balanceError = useUserStore(state => state.balanceError)
  const refreshToken = useUserStore(state => state.refreshToken)
  const hasHydrated = useUserStore(state => state.hasHydrated)

  const { signIn, signOut, refreshBalance, setBalanceLoading, setBalanceSuccess, setBalanceError } =
    useUserStore.getState()

  const userId = user?.id ?? MOCK_USER.id

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
        User store
      </Text>

      <YStack gap="$2">
        <Row label="hydrated" value={String(hasHydrated)} />
        <Row label="user" value={user ? user.username : 'signed out'} />
        <Row label="balance" value={balance === null ? '—' : balance.toFixed(2)} />
        <Row label="status" value={balanceStatus} />
        <Row label="error" value={balanceError ?? '—'} />
        <Row label="refreshToken" value={String(refreshToken)} />
      </YStack>

      <XStack gap="$2" flexWrap="wrap">
        {user ? (
          <Button size="$3" onPress={signOut}>
            Sign out
          </Button>
        ) : (
          <Button size="$3" onPress={() => signIn(MOCK_USER)}>
            Sign in
          </Button>
        )}
        <Button size="$3" onPress={() => setBalanceLoading(userId)}>
          Loading
        </Button>
        <Button size="$3" onPress={() => setBalanceSuccess(userId, 1284.5)}>
          Success
        </Button>
        <Button size="$3" onPress={() => setBalanceError(userId, 'Could not reach wallet')}>
          Error
        </Button>
        <Button size="$3" onPress={refreshBalance}>
          Refresh
        </Button>
      </XStack>

      <Text fontSize="$2" color="$colorMuted">
        Reload the app — the user survives, the balance does not.
      </Text>
    </YStack>
  )
}
