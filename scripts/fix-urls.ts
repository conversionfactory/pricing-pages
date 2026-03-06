import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies } from "../src/lib/schema"
import { eq } from "drizzle-orm"
import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const SCREENSHOTS_DIR = path.resolve(__dirname, "../public/screenshots")

// Slug → correct URL
const FIXES: Record<string, string> = {
  "punch-financial": "https://www.punchfinancial.com/pricing",
  "play-ht": "https://play.ht/pricing/",
  "hetzner-cloud": "https://www.hetzner.com/cloud/",
  "pika": "https://pika.art/pricing",
  "s4labour": "https://www.s4labour.co.uk/pricing",
}

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!))

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  for (const [slug, url] of Object.entries(FIXES)) {
    process.stdout.write(`  ● ${slug} → ${url} — `)

    // Update DB
    await db
      .update(companies)
      .set({ pageUrl: url })
      .where(eq(companies.slug, slug))

    // Re-capture screenshot
    const filepath = path.join(SCREENSHOTS_DIR, `${slug}.png`)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)

    const page = await context.newPage()
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 })
      await page.waitForTimeout(3000)

      for (const selector of [
        '[id*="cookie"] button', '[class*="cookie"] button',
        'button:has-text("Accept")', 'button:has-text("Got it")',
        'button:has-text("Close")',
      ]) {
        try {
          const btn = page.locator(selector).first()
          if (await btn.isVisible({ timeout: 500 })) {
            await btn.click()
            await page.waitForTimeout(300)
            break
          }
        } catch { /* no banner */ }
      }

      await page.screenshot({ path: filepath, fullPage: true })

      await db
        .update(companies)
        .set({ screenshotUrl: `/screenshots/${slug}.png` })
        .where(eq(companies.slug, slug))

      console.log("✓ fixed + re-screenshotted")
    } catch (err) {
      console.log(`✗ screenshot failed: ${err instanceof Error ? err.message : err}`)
    } finally {
      if (!page.isClosed()) await page.close()
    }

    await new Promise((r) => setTimeout(r, 2000))
  }

  await browser.close()
  console.log("\nDone!")
}

main().catch(console.error)
