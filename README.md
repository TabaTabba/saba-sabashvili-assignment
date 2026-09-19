# DuxCasino

The DuxCasino landing page — top navigation, an auto-playing promo slider, and a Popular Games grid
— built once in shared packages and rendered by both a React web app and an Expo app.

Three components, one codebase. There is no "web TopNav" and "native TopNav": each feature is a
single Tamagui component that both apps compose.

```
apps/web          Vite 8 + React 19 + Tamagui          → localhost:5173
apps/native       Expo SDK 54 + Tamagui                → Expo Go
packages/shared-ui       features/{top-nav,promo-slider,popular-games} + theme
packages/shared-api      features/{balance,hero-slides,games} — React Query + mocks
packages/shared-stores   features/user — Zustand + persist
```

---

## Setup

Requires **Node `^20.19.0 || >=22.12.0`** (Vite 8's floor) and **Yarn 1.22**. There is an `.nvmrc`:

```bash
nvm use            # 20.20.0
yarn install       # yarn workspaces, one flat node_modules
```

### Run the web app

```bash
yarn dev:web       # Vite on http://localhost:5173
```

### Run the native app

```bash
yarn workspace @duxcasino/native ios       # Metro + the iOS simulator
yarn workspace @duxcasino/native android   # Metro + an Android emulator
```

Use these rather than `yarn dev:native`, which starts Metro but cannot forward stdin through turbo,
so Expo's `i`/`a` shortcuts are dead there.

Verified on both: an **iPhone 17** simulator and a **Pixel 8 (API 35)** emulator. On Android, Expo
installs Expo Go and sets up the `adb reverse` itself.

If `expo start --ios` hangs on a cold simulator, it is `simctl openurl` timing out while Expo Go
installs. Boot the simulator and launch Expo Go first, then hand it the URL:

```bash
xcrun simctl boot "iPhone 17" && open -a Simulator
(cd apps/native && npx expo start --localhost &)
xcrun simctl terminate <device-udid> host.exp.Exponent     # must not already be running
xcrun simctl openurl   <device-udid> "exp://127.0.0.1:8081"
```

Terminate before `openurl` — if Expo Go is already running the deep link drops you on its home
screen instead.

### Checks

```bash
yarn typecheck     # tsc --noEmit across 5 packages, plus scripts/
yarn lint          # ESLint 9 flat config
yarn test          # Vitest — 86 tests
yarn format:check  # Prettier
yarn build         # production web build
```

All five are green as of the final commit.

### Seeing the loading, error and empty states

Latency is a real 400–800ms, so every skeleton is observable on a normal load. The failure paths are
armed by a query parameter on the web app:

```
http://localhost:5173/?fault=games          # the grid's error state and Try again
http://localhost:5173/?fault=gamesEmpty     # the empty state
http://localhost:5173/?fault=heroSlides     # the slider's error state
http://localhost:5173/?fault=balance        # sign in, then Refresh → "Refresh failed"
http://localhost:5173/?fault=favourite      # a heart flips, rolls back, and says so
```

Comma-separate to combine; unknown names are ignored. **The native app has no equivalent** — see
[Gaps](#gaps-and-what-i-did-not-get-to).

---

## Usage

### Composing the page

Both apps are ~20 lines. This is `apps/web/src/App.tsx` in full:

```tsx
export function App() {
  const [queryClient] = useState(createQueryClient)
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all')

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <YStack backgroundColor="$background" minHeight="100%">
          <TopNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
          <PromoSlider />
          <PopularGames category={activeCategory} />
        </YStack>
      </TamaguiProvider>
    </QueryClientProvider>
  )
}
```

`apps/native/App.tsx` is the same tree inside a `SafeAreaProvider` and a `ScrollView`, plus
`useFonts` for Rubik. The category is the only state an app holds; every component fetches its own
data and reads its own store slice.

### The three components

```tsx
import { PopularGames, PromoSlider, TopNav } from '@duxcasino/shared-ui'

// Logo, nav items, the All Games dropdown, the language selector, and either the
// Login/Sign up pair or the signed-in avatar + balance + refresh control.
<TopNav activeCategory={category} onSelectCategory={setCategory} />

// Fetches its own slides. No props — autoplay, arrows, dots, skeleton, image
// fallback and the payment strip are all internal.
<PromoSlider />

// Fetches page 1 for the category, appends on View more.
<PopularGames category={category} />
```

### The store

```tsx
import { useUserStore } from '@duxcasino/shared-stores'

const user = useUserStore(state => state.user)
const balance = useUserStore(state => state.balance)
const status = useUserStore(state => state.balanceStatus) // idle | loading | success | error
const refreshBalance = useUserStore(state => state.refreshBalance)

refreshBalance() // bumps refreshToken; useUserBalance watches it and refetches
```

Select per field — a whole-state selector re-renders on every balance tick. `user` and `language`
persist (localStorage on web, AsyncStorage on native); balance, status and error deliberately do
not, because a stale balance rendered after a reload is worse than none.

`hasHydrated` is false until persist has read storage. **Gate signed-in UI on it** or native flashes
the signed-out state on every cold start, since AsyncStorage resolves a tick after first render.

### The hooks

```tsx
import { useGames, useHeroSlides, useToggleFavourite, useUserBalance } from '@duxcasino/shared-api'

const { data: slides, isPending, isError, refetch } = useHeroSlides()

// Infinite query; data.pages[].games. Returns fetchNextPage / hasNextPage / isFetchingNextPage.
const { data, fetchNextPage, hasNextPage } = useGames('hot-rtp')

// Optimistic: patches every games cache a game appears in, inverts just that game on failure.
const toggleFavourite = useToggleFavourite()
toggleFavourite.mutate({ gameId, isFavourite: true })

// Reads the user from the store, writes status/balance/error back into it. No arguments.
const { isFetching, error } = useUserBalance()
```

`useUserBalance` is the one seam between the two shared packages: the store owns a `refreshToken`
counter and knows nothing about React Query; the hook watches the counter and calls `refetch()`.

### Design tokens

No component contains a raw colour, spacing value or font size. Everything comes from
`packages/shared-ui/src/theme/tokens.ts`:

```tsx
<YStack backgroundColor="$violet1" padding="$4" borderRadius="$3">
  <Text fontSize="$6" fontWeight={fontWeight.bold} color="$accent" />
</YStack>
```

ESLint enforces the colour half of that: a raw `#hex`, `rgb()` or `hsl()` anywhere under
`apps/*/src` or `packages/*/src` is a build error, with `tokens.ts` itself the only exemption.
Measured Figma geometry lives in named objects in the same file — `nav`, `promo`, `games` — each
with a `laptop` / `tablet` / `phone` set taken off the three design frames.

### Screenshots

```bash
yarn shoot http://localhost:4173 <label>          # all 8 widths
yarn shoot http://localhost:4173 <label> 1366     # just one
```

Captures 360/390/768/1024/1280/1366/1440/1920 into `screenshots/<label>/` and flags horizontal
overflow per width. Point it at `vite preview`, not the dev server, for anything layout-shift
related — Vite injects CSS through JS in dev and invents shifts the built app does not have.

---

## Decisions and tradeoffs

**Packages export TypeScript source** (`"main": "src/index.ts"`), no build step. Vite compiles them;
Metro resolves them through `watchFolders`. The tradeoff is that the packages are not independently
consumable — they are workspace-internal, which is what they are for here. It buys a single watch
loop instead of three.

**`shared-ui` depends on `shared-api` and `shared-stores`, and each component fetches its own data.**
The alternative — presentational components with the apps wiring queries — would have meant the same
wiring written twice, once per app, with two chances to diverge. The cost is that the UI package is
not reusable against a different data layer. For a two-app monorepo with one data layer, that trade
goes the way it went here.

**Slice by feature, never by file type.** A feature never imports another feature; anything two
features need moves up to `components/` or `lib/`. That rule is what produced `lib/pressable.ts`
(the shared focus-ring and keyboard-activation bundle), `lib/categories.ts` and
`components/Skeleton.tsx` — each moved up only when a second real caller appeared, not in
anticipation.

**The design has three frames, and two of the three sections are drawn as different components at
different widths.** The tablet and phone pages replace the hero banner with a card carousel, and
replace the games grid with one horizontally scrolling row per category. The brief asks for one
slider and one filtered grid, so:

- The promo slider builds **both presentations over one track with one index**, so autoplay,
  wrapping, pausing and keyboard behaviour are written once. Building only the hero and scaling it
  down would have missed both of the other frames.
- The games section keeps the **laptop's structure at every width** — a grid with View more — and
  takes each frame's own columns, gaps, gutter and header chrome.

**One `useMedia()` lookup picks a whole geometry set**, rather than stacking `$md`/`$xl` overrides on
every element: `const size = media.xl ? nav.laptop : media.md ? nav.tablet : nav.phone`. Three
measured sets, one branch, and the component body reads as one layout.

**Tile width is measured, not computed from the breakpoint.** The tablet and phone frames' rows
*overflow their own frames* (830 of tiles in a 736 frame) because they scroll — which is exactly
what a grid cannot do. So the container measures itself with `onLayout` and the tile flexes into
what is left. At 1366 that returns the frame's 230 exactly, which a test asserts.

**Above 1366 the page stops growing and centres** in a 1366 column. The hidden `Desktops` 1920 frame
carries a guide marking a 1216 content column, so a centred column is the design's own intent above
the laptop frame.

**The balance counts up with a rAF tween, not Reanimated.** Text content is not animatable by either
Tamagui or Reanimated without dropping to an animated `TextInput`; a 40-line `useCountUp` is
identical on both platforms and needs no `.web`/`.native` split. The brief allows "Reanimated 3 or
equivalent". Reanimated is still the native animation driver for everything that *is* animatable —
`theme/animations.native.ts` re-exports the Reanimated driver, `theme/animations.ts` the CSS one,
and both carry the same 22 keys so `transition` typechecks identically on both sides.

**Platform splits are rare and deliberate** — three files in the whole repo: the store's three
storage adapters (localStorage / AsyncStorage / in-memory for Vitest), `SlideImage.native.tsx` for
`expo-image`, and the animation driver. Everything else is one file.

**The selected language also picks the balance's locale** (`en-GB` / `de-DE` / `fr-FR` / `it-IT`),
so switching it reformats the number rather than only swapping a flag.

**Mock data is 72 games, 12 per category, with providers cycling within a category and badges from
decorrelated deterministic noise.** The first version derived category, provider and badges from one
index and produced a degenerate set: one provider per category, zero hot-RTP badges in the Hot RTP
category, and one page everywhere so View more was dead on every filter.

**The grid only shows whole rows while more pages exist.** A 10-per-page fetch lands mid-row at 3
columns, so each View more left a half-empty row behind — visibly wrong on a phone. The tail is held
back until the next page fills it. Once the data runs out the remainder renders as-is; hiding it
would be hiding data.

**A category switch keeps the previous category on screen until the new one lands, header and all.**
`keepPreviousData` holds the old tiles through the ~500ms fetch rather than blanking the grid, so
the heading and counter read the category of the tiles actually on screen — they come off the page
payload, not the prop. Taking the prop put the new name over the old count and the old tiles.

**Loading states reserve the loaded height.** The slider's loading and error branches reserve
`sectionHeight`, and the grid's skeleton uses flex rows with `aspectRatio={1}` rather than a measured
pixel size. That last one needs no measurement at all, so skeleton and tile land on identical widths
and x positions at every breakpoint. Cumulative layout shift went **0.72 → 0.0001** at the worst
width (see the table below).

**The tiles are not pressable, and five nav items are not focus stops.** There is nowhere for a game
or a "VIP" link to go in this build. A control that announces itself as a button and does nothing is
worse than plain text, so only the things that do something are interactive — which is also why the
tab order is 21 stops rather than 40.

### Deliberate deviations from the design

Each of these is a case where the design and the brief disagree, or where the design has no answer.

| | Design | Built | Why |
|---|---|---|---|
| Hamburger | The phone frame has none — links move to a footer menu | Burger in the left slot, language selector inside the drawer | The brief requires a hamburger; there is no room for both at 360 |
| Signed-in header | Does not exist anywhere in the design | Monogram avatar, bordered balance pill, refresh circle | Built from the design's own vocabulary — same pill and circle shapes as the Login pair it replaces |
| Language flags | One flag (GB), from an unrelated component library | GB/DE/FR/IT authored to the same 22.4×16 box and 2px radius | The brief requires the selector to *change* the flag |
| Refresh icon | Does not exist | Hand-authored | Same |
| Favourite heart | Does not exist | Hand-authored, taking the badge row's height as its hit area | Same |
| Slider arrows at 360 | Dots only, no arrows | The tablet's 24px pair carries over | The brief requires arrows |
| Payments strip | Only in the laptop frame, inside the hero block | Also under the dots below `$xl` | The brief lists it as part of this section |
| Category icons | One per section, but none for `all` or `money` | Label-only headers | Five of seven would read as a bug |
| Tablet swipe buttons | Two, beside the counter | None; the counter right-aligns where the second one ended | They page a scrolling row — a grid has nothing to swipe |
| Game artwork | Per-game bitmaps with the name and line count baked in | One shared placeholder, with the name in a scrim footer and the line count as a badge | The brief requires one reused placeholder, so the baked-in text needs somewhere to go |

---

## Gaps, and what I did not get to

**Sections 03 and 06–13 of the design are not built.** The brief specifies three sections; the page
also contains a ratings strip, a providers row, VIP and app banners and a footer. Building a fourth
because it happens to sit between two of the three would be arbitrary when eight others are omitted
for the same reason. The one consequence is the gap where the ratings strip was: it gets that
frame's own 46px top padding, so the spacing stays inside the design's rhythm rather than being
invented.

**The promo card's amount is Rubik Bold 32; the design has Montserrat Bold 32.** It is the only
Montserrat style in the entire design. A webfont, an `@expo-google-fonts` package and a second
Tamagui font entry for one text node was not a trade worth making.

**Tablet and phone tiles are 131 and 99, not the frames' 150 and 120.** Those frames' rows overflow
by 94 and 64 because they scroll. A grid has to fit, so the column count, gaps and gutter are the
frame's and the tile takes what is left.

**Tamagui's `Button` is not used.** The brief names it in the primitive list; every control here is
built from `YStack`/`XStack`/`Text` plus `lib/pressable.ts`. Each button in the design is a specific
shape — a gradient pill, a bordered pill, a violet veil, a circle — and `Button` brings its own
height scale and internal layout to override at every call site. `pressable()` also had to spread
onto a `LinearGradient`, which a `Button` wrapper could not do. `YStack`, `XStack`, `Text` and
`Image` are all used as the brief asks.

**One word of the promo card's subline should be orange** (`+**150** Free Spins`). That needs the
copy split into parts in the mock API; it renders white.

**The native app has no fault injection.** The `?fault=` parameter is web-only — there is no query
string on native, and a deep-link parser would mean adding a dependency for a debug flag. The error,
empty and rollback paths are the same code on both platforms and are covered by tests in
`shared-api`, but on device you cannot trigger them by hand.

**There is no automated regression test for layout shift.** The CLS numbers below come from a
scratch Playwright probe, not from anything in the repo. `yarn test` is deliberately thin — store
and hooks only, per the brief — so nothing currently stops a future `transition` on a sized box from
reintroducing the shift that Phase 8 removed. This is the gap I would close first.

**Residual CLS of 0.0001 at ≥1280.** It is the webfont swap: the six uppercase nav labels re-measure
by a few px when Rubik lands, and the header's `space-between` redistributes. It only appears where
the inline menu renders. That is 700× below the 0.1 "good" threshold, and the fixes —
`font-display: optional`, or reserving the menu's width — each cost more than they buy.

| Width | CLS before | CLS after |
|---|---|---|
| 360 / 390 / 768 | 0.1037 / 0.1042 / 0.1868 | 0 |
| 1024 | 0.4688 | 0 |
| **1280** | **0.7208** | 0.0001 |
| 1366 / 1440 | 0.2358 / 0.3134 | 0.0001 |
| 1920 | 0.3589 | 0 |

**Native is faithful and responsive, not pixel-matched.** The Figma is a desktop web design; there
is no 390px frame to match, on either mobile platform. Web at 1366 is the pixel-perfect target and was measured element by
element against the frame — the residual deltas there are ≤2.5px and are text metrics, not layout
(Chrome measures uppercase Rubik marginally narrower than Figma does; the anchors are exact).

**Tests are thin by design and cover the store and hooks only** — 86 of them. There are no component
render tests and no end-to-end tests. Behaviour that a unit test would not reach was verified in a
real browser and on device instead, per phase: tab order walked with real `Tab` presses, the
carousel's animation sampled frame by frame, the optimistic rollback triggered and observed, grid
geometry measured at every breakpoint. That verification is recorded but not re-runnable, which is
the same gap as the CLS one.

---

## Where I used AI

I built this with Claude Code, in a long-running session per phase, against a build prompt I wrote
first and a `CLAUDE.md` of house rules the model had to follow. The split was roughly:

**AI did most of the typing.** Component scaffolding, the Tamagui config, the mock data generator,
the test files, and the first draft of nearly every file. Also the mechanical work that is easy to
get subtly wrong: transcribing measured Figma geometry into token objects, and the responsive sweeps.

**AI did the measurement, which is where it was worth the most.** Every "pixel pass" table in this
repo's history is real DOM measurement driven by a Playwright script, not eyeballed from a
screenshot — element boxes read out of the live page and diffed against `get_design_context` values
from Figma. Same for the CLS numbers, the animation frame sampling, and the tab-order walks. A human
doing that by hand would have done it once; doing it after every change is what caught things like
the skeleton animating its own size.

**And measurement has a blind spot that cost me two real bugs.** A `getBoundingClientRect()` reports
an element's *layout* box — not what is painted, and not what a pointer can reach. So a heading that
clipped its own glyphs measured correct (the box was where the design says, the ink was cut), and
dropdown panels that closed before you could reach an option passed every check, because
`page.click` teleports the pointer instead of travelling to the target. Both were found by a person
using the page, after the automated passes said it was clean. Measurement is a good check on
geometry and a poor one on whether something works.

**I set the constraints and made the calls.** The architecture rules, the style rules, the phase
plan, and every decision in the two tables above — what to deviate from in the design, what to omit,
what not to abstract — were mine. AI proposed alternatives on several of them and was overruled on
some: the suggested fix for raw font weights was Tamagui's `$N` weight tokens, which are keyed by
size step and would have meant borrowing an unrelated size's token to express "bold at 12px"; a
named `fontWeight` map went in instead.

**Every phase was reviewed by a second AI pass** (a `typescript-reviewer` subagent reading the
diff, plus a full review at the end) and I checked its findings before taking them. It was right
about real bugs — a favourite rollback that wiped concurrent toggles, a persist migration that cast
`unknown` straight to a shape, mock data that made View more dead on every filter. It was also
wrong: one finding claimed a double-fetch on sign-in that I could not reproduce, and I kept the
guard as explicit intent while noting in the history that the test does not prove it is
load-bearing.

**What AI got wrong, repeatedly, and what that cost.** It diagnosed by plausibility rather than by
evidence unless pushed. A blank native screen was blamed on layout when the cause was
`fastSchemeChange: true` resolving themed colours through `DynamicColorIOS` with no light theme to
resolve to — found by four coloured bars in one screenshot and a `theme.accent.get()` log, not by
reading code. A missing badge was blamed on the badge component when the cause was the placeholder
being too bright underneath it. The pattern that worked, and that is written into `CLAUDE.md`, is to
make the model bisect and *measure* before it edits: read `naturalWidth` before believing a render
bug, log the token before suspecting the layout, plant a probe file and check it errors before
claiming a type is enforced.

---

## Design reference

Figma: [Online Casino — Gambling design](https://www.figma.com/design/QnGheM0wuzg1mJzHXnHGKA/Online-Casino-%7C-Gambling-design--Community-?node-id=3-2)
(Community, CC BY 4.0), duplicated to read node-level values. Three frames: Laptop 1366, Tablet 768,
Phone 360. Rubik throughout; 8 colour variables; type scale 10/12/14/16/20/22/30/112. The design
defines no spacing variables, so the space scale is measured off the frames.
