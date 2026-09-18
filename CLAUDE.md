# DuxCasino — working notes

Cross-platform casino landing page. Expo + React web sharing three packages. Built from a Figma
design as a frontend assignment.

## Non-negotiable: this is a shared Mac

Your shell default is Node **v20.16.0** (`/usr/local/bin/node`, a system install that shadows nvm —
the nvm `default` alias says 18.18.2 but never wins). 20.16.0 does **not** satisfy Vite 8, which
needs `^20.19.0 || >=22.12.0`. **Prefix every shell command:**

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" && <command>
```

Never run `nvm alias default`, `nvm install`, `npm install -g`, `yarn global add`, `corepack enable`,
or `brew install`. Never write outside this directory. Everything is a project-local devDependency.

## Commands

```bash
yarn dev:web        # Vite on :5173
yarn dev:native     # Expo; see the launch sequence below — `expo start --ios` alone fails
yarn typecheck      # tsc --noEmit across 5 packages, plus scripts/
yarn lint           # ESLint 9 flat config, plus scripts/
yarn test           # Vitest — shared-stores, shared-api, shared-ui only
yarn format:check   # Prettier, code files only (not the hand-wrapped .md)
yarn shoot <url> <label> [width]   # Playwright screenshots into screenshots/<label>/
```

`yarn shoot` captures 360/390/768/1024/1280/1366/1440/1920 and flags horizontal overflow per width.
Pass a single width to refresh just that one. It pins `PLAYWRIGHT_BROWSERS_PATH` to `./.browsers` via
`$INIT_CWD`, so Chromium stays inside the repo — run it from the repo root.

The apps have no `test` script: per the brief, tests are thin and cover the store and hooks only.
That also keeps `vitest`'s `vite@7` out of the web app, which builds on `vite@8`.

### Running the native app

`expo start --ios` fails on a cold simulator — `simctl openurl` times out while Expo Go installs.
Launch Expo Go first, then hand it the URL:

```bash
D=EFA00042-06D3-44BE-8E50-F16823F285A0        # iPhone 17
xcrun simctl boot "iPhone 17" && open -a Simulator
(cd apps/native && npx expo start --localhost &)

xcrun simctl terminate $D host.exp.Exponent   # must not already be running
xcrun simctl openurl   $D "exp://127.0.0.1:8081"
sleep 20 && xcrun simctl io booted screenshot screenshots/<label>/native.png
```

**Terminate first, then `openurl` alone.** If Expo Go is already running, `openurl` drops you on its
home screen instead of deep-linking, and you get a blank white screenshot that looks exactly like a
render failure but isn't — Metro shows no new bundle request, which is the tell. Don't `launch` and
then `openurl`; that's the broken order.

The very first run of all is the exception: Expo Go has to download, and `openurl` times out after
60s. Run it once, let the install finish, then use the sequence above.

## Layout

```
apps/web          Vite + React + Tamagui
apps/native       Expo SDK 54 + Tamagui
packages/shared-ui       features/{top-nav,promo-slider,popular-games} + theme + dev
packages/shared-api      features/{balance,hero-slides,games} — React Query + mocks
packages/shared-stores   features/user — Zustand + persist
```

`shared-ui/src/dev/` holds throwaway demo screens that prove the tokens and store resolve on both
platforms. Delete the whole folder in Phase 7.

Packages export TypeScript source directly (`"main": "src/index.ts"`) — no build step. Vite compiles
it; Metro resolves it via `watchFolders` pointing at the repo root.

## Architecture rules

- Slice by **feature**, never by file type.
- A feature never imports another feature. Shared code moves up to `components/` or `lib/`.
- Each feature has exactly one `index.ts`; nothing reaches into a feature's internals.
- Barrels only at feature and package roots.
- Apps compose features and hold no business logic.

## Style

Function declarations for components and hooks. Named exports only — no default exports, enforced by
lint. PascalCase component filenames, camelCase for everything else. `interface` for props, `type`
for unions. Props destructured in the signature against a named interface above the component. No
semicolons, single quotes, 2-space indent, trailing commas.

Comments only where the *why* isn't derivable from the code. No JSDoc on obvious props, no
section-divider banners, no restating the line below.

No abstraction until three real callers. Prefer the boring, direct implementation.

**No hardcoded colours, spacing or font sizes in components** — every value is a Tamagui token from
`packages/shared-ui/src/theme/tokens.ts`.

ESLint enforces the colour half of that: a raw `#hex`, `rgb()`/`rgba()` or `hsl()`/`hsla()` string
anywhere under `apps/*/src` or `packages/*/src` is an error. Only
`packages/shared-ui/src/theme/tokens.ts` is exempt — that one file is the palette. Raw spacing and
font-size *numbers* are not machine-checkable, so they're on the reviewer to catch.

ESLint also cannot see JSON, so `apps/native/app.json`'s window colours are guarded by
`apps/native/appConfig.test.ts`, which asserts they equal `palette.night`.

## Version notes that bit us

- **Tamagui is v2**, not v1. Config preset is `@tamagui/config/v4`. We set
  `onlyAllowShorthands: false` so components read `backgroundColor`, not `bg`.
- **Tamagui's `size` token group is a component-height scale, not spacing** — its `$true` is 44, a
  button height. We keep Tamagui's own `size` and put measured design constants in `layout` (plain
  numbers, not tokens), because Tamagui steps tokens by sorted numeric index and salting a group
  with one-off values makes `$4` step to the wrong neighbour.
- **The config keeps only the `dark` theme, layered over Tamagui's default dark.** The default dark
  carries ~130 keys built-ins read (`outlineColor`, `placeholderColor`, `shadowColor`,
  `background0x`); replacing it wholesale breaks them silently. Carrying the other 293 themes is not
  an option either — Tamagui types themes by their shared shape, so custom keys like `$accent` stop
  resolving.
- **Reanimated is v4**, not v3. Its Babel plugin moved to `react-native-worklets/plugin` and must be
  the last entry in `babel.config.js`.
- **Vite is v8.** `optimizeDeps.esbuildOptions` is gone; it uses Rolldown.
- `apps/web` is `"type": "module"` so `vite.config.ts` loads natively.
- **`vitest@latest` is v5 and needs Node >=22.** Pinned to `^3`. Don't let it float up.
- Root `resolutions` pins a single `@types/react` / `@types/react-dom`. Without it yarn nests a
  second copy under `apps/web` and cross-package `ReactNode` props stop assigning to each other.
- `turbo.json` lists `globalDependencies`. Without it turbo cache-hits `lint`/`typecheck` after you
  edit `eslint.config.mjs` or `tsconfig.base.json`, and the gates go green without running.
- `.claude/agents/*.md` register at session start; a file added mid-session isn't selectable until
  the next one.

## Git

**Never commit.** Suggest a commit at each phase boundary; the human runs it.
