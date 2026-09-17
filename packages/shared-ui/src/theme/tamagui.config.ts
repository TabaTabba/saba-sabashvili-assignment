import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

// Phase 1 replaces the preset tokens with values pulled from Figma.
export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    // Full property names read better than `bg`/`px` in review.
    onlyAllowShorthands: false,
  },
})

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
