import { LinearGradient } from '@tamagui/linear-gradient'
import { useUserStore } from '@duxcasino/shared-stores'
import { Text, XStack } from 'tamagui'

import { fontWeight } from '../../../theme/fonts'
import { nav } from '../../../theme/tokens'
import { DEMO_USER, PRESS_OPACITY } from '../constants'

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
        cursor="pointer"
        pressStyle={{ opacity: PRESS_OPACITY }}
        hoverStyle={{ borderColor: '$color' }}
        onPress={() => signIn(DEMO_USER)}
        role="button"
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
        cursor="pointer"
        pressStyle={{ opacity: PRESS_OPACITY }}
        onPress={() => signIn(DEMO_USER)}
        role="button"
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
    <Text fontSize="$3" fontWeight={fontWeight.semibold} textTransform="uppercase" color="$color">
      {children}
    </Text>
  )
}
