import { palette } from '@duxcasino/shared-ui'
import { describe, expect, it } from 'vitest'

import appJson from './app.json'

// These must be literals — Expo's config loader can't import the workspace's TS exports. ESLint
// can't see JSON either, so this test is the only thing stopping them drifting from the token.
describe('app.json window colours', () => {
  const { expo } = appJson

  it.each([
    ['backgroundColor', expo.backgroundColor],
    ['splash.backgroundColor', expo.splash.backgroundColor],
    ['ios.backgroundColor', expo.ios.backgroundColor],
    ['android.adaptiveIcon.backgroundColor', expo.android.adaptiveIcon.backgroundColor],
  ])('%s matches palette.night', (_name, value) => {
    expect(value).toBe(palette.night)
  })
})
