import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
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
