import { LinearGradient } from '@tamagui/linear-gradient'
import { useUserStore } from '@duxcasino/shared-stores'
import { Text, XStack } from 'tamagui'

import { fontWeight } from '../../../theme/fonts'
import { DEMO_USER } from '../../../lib/demoUser'
import { aboveGradient } from '../../../lib/gradient'
import { PRESS_OPACITY, pressable } from '../../../lib/pressable'
import { nav } from '../../../theme/tokens'

interface AuthButtonsProps {
  width: number
  height: number
  gap: number
}

export function AuthButtons({ width, height, gap }: AuthButtonsProps) {
  const signIn = useUserStore(state => state.signIn)

  return (
    <XStack gap={gap} alignItems="center">
      <XStack
        width={width}
        height={height}
        borderRadius={nav.authRadius}
        borderWidth={nav.borderWidth}
        borderColor="$colorMuted"
        alignItems="center"
        justifyContent="center"
        pressStyle={{ opacity: PRESS_OPACITY }}
        hoverStyle={{ borderColor: '$color' }}
        {...pressable(() => signIn(DEMO_USER))}
      >
        <Label>Login</Label>
      </XStack>

      <LinearGradient
        width={width}
        height={height}
        borderRadius={nav.authRadius}
        colors={['$signUpTop', '$signUpBottom']}
        start={[0, 0]}
        end={[0, 1]}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ opacity: PRESS_OPACITY }}
        {...pressable(() => signIn(DEMO_USER))}
      >
        <Label>Sign up</Label>
      </LinearGradient>
    </XStack>
  )
}

interface LabelProps {
  children: string
}

function Label({ children }: LabelProps) {
  return (
    <Text
      {...aboveGradient}
      fontSize="$3"
      fontWeight={fontWeight.semibold}
      textTransform="uppercase"
      color="$color"
    >
      {children}
    </Text>
  )
}
