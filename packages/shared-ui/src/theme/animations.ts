// The v4 preset's driver is CSS-only and silently animates nothing on native. Split instead:
// CSS here, Reanimated in animations.native.ts. Same 22 keys, so `transition` typechecks on both.
export { animations } from '@tamagui/config/v5-css'
