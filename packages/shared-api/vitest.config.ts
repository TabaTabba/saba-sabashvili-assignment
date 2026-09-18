import { defineConfig } from 'vitest/config'

// No @vitejs/plugin-react here: it requires Vite 8 while vitest pulls Vite 7, and esbuild already
// handles the TSX in these tests via tsconfig's jsx: react-jsx.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    // Testing Library only registers its auto-cleanup when a global afterEach exists; without it
    // every renderHook stays mounted for the whole file and leaks into the next test.
    globals: true,
    // Every request carries the brief's deliberate 400-800ms latency, so a test that awaits two
    // queries and a mutation runs past vitest's 5s default.
    testTimeout: 20_000,
  },
})
