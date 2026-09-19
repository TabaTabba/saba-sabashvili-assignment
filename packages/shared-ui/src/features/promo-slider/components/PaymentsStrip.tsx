import { YStack } from 'tamagui'

import Payments from '../../../assets/payments.svg'
import { promo } from '../../../theme/tokens'

interface PaymentsStripProps {
  width: number
}

// The asset exports with preserveAspectRatio="none", so the height is driven off the width to
// avoid squashing. Exported because the slider reserves this height while the query is loading.
export function paymentsStripHeight(width: number) {
  return (width / promo.paymentsWidth) * promo.paymentsHeight
}

// payments [1] vector 52:303 — the design puts it inside the hero block, under the CTA.
export function PaymentsStrip({ width }: PaymentsStripProps) {
  const height = paymentsStripHeight(width)

  return (
    <YStack aria-label="Accepted payment methods">
      <Payments width={width} height={height} />
    </YStack>
  )
}
