import { useUserBalance } from '@duxcasino/shared-api'
import { useUserStore } from '@duxcasino/shared-stores'
import type { Language } from '@duxcasino/shared-stores'
import { Text, XStack } from 'tamagui'

import { fontWeight } from '../../../theme/fonts'
import { nav } from '../../../theme/tokens'
import { LANGUAGE_LOCALES } from '../constants'
import { useCountUp } from '../hooks/useCountUp'

const MIN_WIDTH = 130
const NO_BALANCE = '—'

interface BalanceDisplayProps {
  height: number
}

export function BalanceDisplay({ height }: BalanceDisplayProps) {
  useUserBalance()

  const balance = useUserStore(state => state.balance)
  const balanceStatus = useUserStore(state => state.balanceStatus)
  const currency = useUserStore(state => state.user?.currency)
  const language = useUserStore(state => state.language)

  const animated = useCountUp(balance)
  const hasFailed = balanceStatus === 'error'

  return (
    <XStack
      height={height}
      minWidth={MIN_WIDTH}
      paddingHorizontal="$5"
      borderRadius={nav.authRadius}
      borderWidth={nav.borderWidth}
      borderColor={hasFailed ? '$danger' : '$colorMuted'}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="$3" fontWeight={fontWeight.semibold} color={hasFailed ? '$danger' : '$color'}>
        {hasFailed ? 'Refresh failed' : formatBalance(animated, currency, language)}
      </Text>
    </XStack>
  )
}

function formatBalance(amount: number | null, currency: string | undefined, language: Language) {
  if (amount === null || currency === undefined) return NO_BALANCE

  return new Intl.NumberFormat(LANGUAGE_LOCALES[language], {
    style: 'currency',
    currency,
  }).format(amount)
}
