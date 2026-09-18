import { readFile } from 'node:fs/promises'

import { transform as svgrTransform } from '@svgr/core'
import jsx from '@svgr/plugin-jsx'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig, transformWithOxc } from 'vite'

// The published vite-plugin-svgr hoists to the repo root, where its own bare `import('vite')`
// finds vitest's Vite 7 and the missing transformWithOxc. Inlined here instead: this config is
// loaded by the app's Vite 8, so the import resolves to that. Matching Metro's
// react-native-svg-transformer, a plain `.svg` import yields a component — no `?react` suffix.
function svgr(): Plugin {
  return {
    name: 'svgr',
    enforce: 'pre',
    async load(id) {
      const filePath = id.replace(/[?#].*$/s, '')
      if (!filePath.endsWith('.svg')) return

      const svg = await readFile(filePath, 'utf8')
      const component = await svgrTransform(
        svg,
        {},
        { filePath, caller: { defaultPlugins: [jsx] } },
      )
      const { code } = await transformWithOxc(component, id, { lang: 'jsx' })

      return { code, map: null }
    },
  }
}

export default defineConfig({
  plugins: [svgr(), react()],
  define: {
    'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
  },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    // Vite's defaults plus .web.* first, so shared components resolve their web build over .native.
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.mjs',
      '.js',
      '.mts',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
    ],
  },
})
