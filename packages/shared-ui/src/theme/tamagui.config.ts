import { defaultConfig, tokens as defaultTokens } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

import { animations } from './animations'
import { rubik } from './fonts'
import { themes } from './themes'
import { palette, radius, space } from './tokens'

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    body: rubik,
    heading: rubik,
  },
  themes,
  tokens: {
    ...defaultTokens,
    color: palette,
    space,
    radius,
  },
  settings: {
    ...defaultConfig.settings,
    // Full property names read better than `bg`/`px` in review.
    onlyAllowShorthands: false,
    // true (the default) resolves themed colours via DynamicColorIOS; with only a dark theme the
    // light branch is empty and every themed background stops painting on iOS.
    fastSchemeChange: false,
    shouldAddPrefersColorThemes: false,
  },
})

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
