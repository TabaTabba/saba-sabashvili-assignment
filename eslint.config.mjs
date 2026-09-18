import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

const RAW_COLOR = String.raw`^(#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(.*\)|hsla?\(.*\))$`

const noDefaultExport = {
  selector: 'ExportDefaultDeclaration',
  message: 'Named exports only — no default exports.',
}

const noRawColor = {
  selector: `Literal[value=/${RAW_COLOR}/]`,
  message: 'Hardcoded colour. Use a Tamagui token from shared-ui/src/theme/tokens.ts.',
}

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.expo/**',
      '**/.turbo/**',
      '**/screenshots/**',
      '**/.browsers/**',
      // Build tooling is default-export by contract.
      'eslint.config.mjs',
      '**/*.config.{js,cjs,mjs,ts,mts}',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-syntax': ['error', noDefaultExport],
    },
  },
  {
    // Every colour in app and package source comes from a token. theme/ is where they're defined.
    files: ['apps/*/src/**/*.{ts,tsx}', 'apps/*/*.tsx', 'packages/*/src/**/*.{ts,tsx}'],
    // Only the palette file may hold raw colour values.
    ignores: ['packages/shared-ui/src/theme/tokens.ts'],
    rules: {
      'no-restricted-syntax': ['error', noDefaultExport, noRawColor],
    },
  },
  {
    // tsconfig.base.json puts DOM in `lib` for every package, so a DOM global in a file Metro
    // resolves typechecks cleanly and then throws on device. TypeScript cannot scope `lib` per
    // file, so the rule lives here instead. Deferred from Phase 0 until platform files existed.
    files: ['**/*.native.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...['document', 'localStorage', 'sessionStorage', 'HTMLElement', 'getComputedStyle'].map(
          name => ({ name, message: `${name} does not exist on native.` }),
        ),
      ],
    },
  },
  {
    // The Tamagui config augmentation requires an empty extending interface.
    files: ['packages/shared-ui/src/theme/tamagui.config.ts'],
    rules: { '@typescript-eslint/no-empty-object-type': 'off' },
  },
  prettier,
)
