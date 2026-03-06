import { config } from "dotenv"
config({ path: ".env.local" })

import { chromium } from "playwright"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { eq } from "drizzle-orm"
import { companies } from "../src/lib/schema"
import path from "path"
import fs from "fs"

const SCREENSHOTS_DIR = path.resolve(__dirname, "../public/screenshots")
const VIEWPORT = { width: 1440, height: 900 }
const TIMEOUT = 30_000
const DELAY_BETWEEN = 2_000

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql)

  // Ensure output dir exists
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })

  // Get all companies with a pageUrl
  const allCompanies = await db
    .select()
    .from(companies)
    .orderBy(companies.name)

  const toCapture = allCompanies.filter((c) => c.pageUrl)
  console.log(`Found ${toCapture.length} companies with URLs to screenshot\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    // Dismiss cookie banners etc by looking like a real visitor
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  let success = 0
  let failed = 0

  for (const company of toCapture) {
    const filename = `${company.slug}.png`
    const filepath = path.join(SCREENSHOTS_DIR, filename)

    // Skip if screenshot already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ✓ ${company.name} — already exists, skipping`)
      // Still update DB if needed
      if (!company.screenshotUrl) {
        await db
          .update(companies)
          .set({ screenshotUrl: `/screenshots/${filename}` })
          .where(eq(companies.id, company.id))
      }
      success++
      continue
    }

    try {
      console.log(`  ● ${company.name} — ${company.pageUrl}`)
      const page = await context.newPage()

      await page.goto(company.pageUrl!, {
        waitUntil: "domcontentloaded",
        timeout: TIMEOUT,
      })

      // Wait for page to settle after DOM load
      await page.waitForTimeout(3000)

      // Wait a moment for lazy-loaded content
      await page.waitForTimeout(1500)

      // Dismiss common cookie/consent banners by clicking common selectors
      for (const selector of [
        '[id*="cookie"] button',
        '[class*="cookie"] button',
        '[id*="consent"] button',
        'button:has-text("Accept")',
        'button:has-text("Got it")',
        'button:has-text("OK")',
        'button:has-text("Close")',
      ]) {
        try {
          const btn = page.locator(selector).first()
          if (await btn.isVisible({ timeout: 500 })) {
            await btn.click()
            await page.waitForTimeout(300)
            break
          }
        } catch {
          // Ignore — no banner to dismiss
        }
      }

      await page.screenshot({
        path: filepath,
        fullPage: true,
      })

      // Update DB
      await db
        .update(companies)
        .set({ screenshotUrl: `/screenshots/${filename}` })
        .where(eq(companies.id, company.id))

      console.log(`    ✓ saved`)
      success++
      await page.close()

      // Be polite between requests
      await new Promise((r) => setTimeout(r, DELAY_BETWEEN))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`    ✗ failed: ${msg}`)
      failed++
    }
  }

  await browser.close()
  console.log(`\nDone: ${success} captured, ${failed} failed`)
}

main().catch(console.error)
