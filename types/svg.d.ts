// Both bundlers turn a `.svg` import into a component: vite-plugin-svgr on web, and
// react-native-svg-transformer on native. Typed structurally rather than against
// react-native-svg's SvgProps so shared-ui does not need that dependency on web.
// Pulled into every package's program by `files` in tsconfig.base.json.
declare module '*.svg' {
  import type { ComponentType } from 'react'

  interface SvgAssetProps {
    width?: number | string
    height?: number | string
  }

  const Svg: ComponentType<SvgAssetProps>
  export default Svg
}
