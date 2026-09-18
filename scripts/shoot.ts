import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

import { chromium } from 'playwright'

const BREAKPOINTS = [360, 390, 768, 1024, 1280, 1366, 1440, 1920] as const

const ARTWORK_TIMEOUT_MS = 8000

const [, , urlArg, labelArg, widthArg] = process.argv

const url = urlArg ?? 'http://localhost:5173'
const label = labelArg ?? 'shot'

function parseWidth(value: string | undefined): number | null {
  if (value === undefined) return null
  const width = Number(value)
  if (!Number.isFinite(width) || width <= 0) {
    console.error(`Invalid width "${value}" — pass a positive number, or omit it for all widths.`)
    process.exit(1)
  }
  return width
}

const only = parseWidth(widthArg)
const widths = only === null ? [...BREAKPOINTS] : [only]
const outDir = path.resolve(import.meta.dirname, '..', 'screenshots', label)

async function main() {
  // A single-width run refreshes just that file; a full run starts from a clean directory.
  if (only === null) await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  let failed = false

  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const response = await page.goto(url, { waitUntil: 'load' })

      if (response && !response.ok()) {
        console.error(`${width}px → HTTP ${response.status()} from ${url}`)
        failed = true
        await page.close()
        continue
      }

      // The promo slider advances on a timer and its artwork comes from the network, so without
      // both of these the sweep captures a different slide at every width. Parking the pointer over
      // the slider is how a visitor pauses it, so this exercises the real behaviour rather than
      // reaching for a test hook.
      const slider = await page.$('[aria-label="Promotions"]')
      const sliderBox = await slider?.boundingBox()
      if (sliderBox) await page.mouse.move(sliderBox.x + sliderBox.width / 2, sliderBox.y + 8)

      // Off-screen slides are lazy and may never load, so only what is on screen has to be ready.
      await page
        .waitForFunction(
          () =>
            Array.prototype.every.call(document.images, function (image: HTMLImageElement) {
              const box = image.getBoundingClientRect()
              const onScreen =
                box.right > 0 &&
                box.left < window.innerWidth &&
                box.bottom > 0 &&
                box.top < window.innerHeight
              return !onScreen || image.complete
            }),
          null,
          { timeout: ARTWORK_TIMEOUT_MS },
        )
        .catch(() => console.warn(`${width}px → artwork did not finish loading`))

      // Let entry animations and skeleton swaps settle before capturing.
      await page.waitForTimeout(1200)

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )

      await page.screenshot({ path: path.join(outDir, `${width}.png`), fullPage: true })
      await page.close()

      const flag = overflow > 0 ? `  ⚠️  ${overflow}px horizontal overflow` : ''
      console.log(`${width}px → ${label}/${width}.png${flag}`)
    }
  } finally {
    await browser.close()
  }

  if (failed) process.exit(1)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
