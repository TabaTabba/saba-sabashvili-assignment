import { defineConfig } from 'vitest/config'

// Mirrors shared-api's config — no @vitejs/plugin-react (it wants Vite 8 while vitest pulls Vite 7;
// esbuild handles the TSX via tsconfig's jsx: react-jsx) and globals so Testing Library registers
// its auto-cleanup.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
