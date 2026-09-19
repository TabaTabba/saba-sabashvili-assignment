import { YStack } from 'tamagui'

import Payments from '../../../assets/payments.svg'
import { promo } from '../../../theme/tokens'

interface PaymentsStripProps {
  width: number
}

// The asset exports with preserveAspectRatio="none", so height follows width. Exported because the
// slider reserves this height while loading.
export function paymentsStripHeight(width: number) {
  return (width / promo.paymentsWidth) * promo.paymentsHeight
}

export function PaymentsStrip({ width }: PaymentsStripProps) {
  const height = paymentsStripHeight(width)

  return (
    <YStack aria-label="Accepted payment methods">
      <Payments width={width} height={height} />
    </YStack>
  )
}
