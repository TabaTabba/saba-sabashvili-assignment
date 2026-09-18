import { useUserStore } from '@duxcasino/shared-stores'
import { Image, Spinner, Text, XStack, YStack } from 'tamagui'

import RefreshIcon from '../../../assets/icon-refresh.svg'
import { pressable } from '../../../lib/pressable'
import { fontWeight } from '../../../theme/fonts'
import { nav } from '../../../theme/tokens'
import { PRESS_OPACITY } from '../constants'
import { BalanceDisplay } from './BalanceDisplay'

const REFRESH_ICON = 16

interface AccountControlsProps {
  height: number
  controlSize: number
  gap: number
}

export function AccountControls({ height, controlSize, gap }: AccountControlsProps) {
  const user = useUserStore(state => state.user)
  const isRefreshing = useUserStore(state => state.balanceStatus === 'loading')
  const signOut = useUserStore(state => state.signOut)
  const refreshBalance = useUserStore(state => state.refreshBalance)

  if (!user) return null

  return (
    <XStack gap={gap} alignItems="center">
      <YStack
        width={controlSize}
        height={controlSize}
        borderRadius={controlSize}
        backgroundColor="$surfaceRaised"
        borderWidth={nav.borderWidth}
        borderColor="$colorMuted"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        pressStyle={{ opacity: PRESS_OPACITY }}
        {...pressable(signOut)}
        aria-label={`Sign out ${user.username}`}
      >
        <Text fontSize="$3" fontWeight={fontWeight.bold} color="$color">
          {user.username.slice(0, 1).toUpperCase()}
        </Text>
        {user.avatarUrl ? (
          <Image position="absolute" width="100%" height="100%" source={{ uri: user.avatarUrl }} />
        ) : null}
      </YStack>

      <BalanceDisplay height={height} />

      <YStack
        width={controlSize}
        height={controlSize}
        borderRadius={controlSize}
        borderWidth={nav.borderWidth}
        borderColor="$colorMuted"
        alignItems="center"
        justifyContent="center"
        pressStyle={{ opacity: PRESS_OPACITY }}
        hoverStyle={{ borderColor: '$color' }}
        {...pressable(refreshBalance)}
        aria-label="Refresh balance"
      >
        {isRefreshing ? (
          <Spinner size="small" color="$color" />
        ) : (
          <RefreshIcon width={REFRESH_ICON} height={REFRESH_ICON} />
        )}
      </YStack>
    </XStack>
  )
}
