import { YStack } from 'tamagui'

import Payments from '../../../assets/payments.svg'
import { promo } from '../../../theme/tokens'

interface PaymentsStripProps {
  width: number
}

// payments [1] vector 52:303 — the design puts it inside the hero block, under the CTA. The asset
// exports with preserveAspectRatio="none", so the height is driven off the width to avoid squashing.
export function PaymentsStrip({ width }: PaymentsStripProps) {
  const height = (width / promo.paymentsWidth) * promo.paymentsHeight

  return (
    <YStack aria-label="Accepted payment methods">
      <Payments width={width} height={height} />
    </YStack>
  )
}
