import type { GameBadges } from '@duxcasino/shared-api'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Text, XStack } from 'tamagui'

import Flame from '../../../assets/icon-flame.svg'
import { aboveGradient } from '../../../lib/gradient'
import { fontWeight } from '../../../theme/fonts'
import { games } from '../../../theme/tokens'
import type { GamesGeometry } from '../types'

interface TileBadgesProps {
  badges: GameBadges
  size: GamesGeometry
}

// Labels 107:3803. The caller bounds the row's right edge, so the pill shrinks instead of reaching
// under the favourite control.
export function TileBadges({ badges, size }: TileBadgesProps) {
  return (
    <XStack flexShrink={1} gap={size.badgeGap} alignItems="center" overflow="hidden">
      {badges.flame ? <Flame width={size.badgeSize} height={size.badgeSize} /> : null}

      {badges.hotRtp ? (
        <LinearGradient
          width={size.hotRtpWidth}
          height={size.badgeSize}
          flexShrink={1}
          borderRadius={games.tileRadius}
          borderWidth={size.badgeBorderWidth}
          borderColor="$hotRtpBorder"
          paddingHorizontal={size.badgePaddingHorizontal}
          colors={['$hotRtpStart', '$hotRtpEnd']}
          start={[0, 0]}
          end={[1, 0]}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <Text
            {...aboveGradient}
            fontSize={size.badgeFont}
            lineHeight={size.badgeFont}
            fontWeight={fontWeight.bold}
            textTransform="uppercase"
            color="$color"
            numberOfLines={1}
          >
            Hot RTP
          </Text>
        </LinearGradient>
      ) : null}
    </XStack>
  )
}
