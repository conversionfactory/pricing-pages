import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies } from "../src/lib/schema"
import { chromium, type BrowserContext } from "playwright"
import fs from "fs"
import path from "path"

const CSV_PATH = process.argv[2] || path.resolve(
  process.env.HOME!,
  "Downloads/google_us_pricing-page_matching-terms_2026-03-06_00-15-34 - Sheet1.csv"
)
const SCREENSHOTS_DIR = path.resolve(__dirname, "../public/screenshots")

// Keywords that aren't actual SaaS brands
const SKIP_PATTERNS = [
  /^pricing page/, /^saas pricing/, /^landing page/, /^web page/,
  /^company pricing/, /^status page/,
  /design/i, /template/i, /examples?$/i, /best practices/i,
  /html css/i, /wireframe/i, /optimization/i, /conversion/i,
  /^on seo/i, /per page/i, /per gb/i, /per month/i, /per 1k/i,
  /tokens/i, /\$\d+/, /official/i, /plans$/i, /gpt-\d/i,
  /models?\b/i, /2024|2025|2026/, /dark mode/i,
  /^bio /i, /^how /i, /^best /i, /^top /i, /^what /i, /^free /i,
  /transparency/i, /fair policy/i,
  /amazon /i, /^aws /i, /^azure /i, /^google cloud/i, // cloud sub-products
  /cloudflare \w/i,  // cloudflare sub-products like "cloudflare r2"
  /company[_ ]/i,    // "company pricing page", "company_name"
  /genai/i,          // "company genai"
  /^openai /i,       // all openai variants already aliased above
  /^chatgpt /i,      // all chatgpt variants
  /^anthropic /i,    // all anthropic variants
  /^deepseek /i,     // deepseek sub-variants
  /\bapi\b/i,        // "X api pricing page"
  / pro\b/i,         // "canva pro", "perplexity pro"
  / plus\b/i,        // "chatgpt plus"
  / product\b/i,     // "zendesk product"
  / premium\b/i,     // "linkedin premium"
  / navigator\b/i,   // "linkedin sales navigator"
  / hub\b/i,         // "hubspot sales hub"
  /^linkedin/i,      // linkedin variants
  /gmail/i,          // gmail variants
  /^salesforce /i,   // salesforce sub-products
]

// Brand aliases — map variant keywords to a single canonical name
const BRAND_ALIASES: Record<string, string> = {
  "openai api": "OpenAI",
  "openai chatgpt": "OpenAI",
  "chatgpt": "OpenAI",
  "openai": "OpenAI",
  "openai platform": "OpenAI",
  "anthropic claude": "Anthropic",
  "anthropic api": "Anthropic",
  "anthropic": "Anthropic",
  "claude": "Anthropic",
  "claude ai": "Anthropic",
  "github copilot": "GitHub Copilot",
  "cursor ide": "Cursor",
  "cursor ai": "Cursor",
  "cursor editor": "Cursor",
  "cursor ai editor": "Cursor",
  "cursor ai code editor": "Cursor",
  "cursor": "Cursor",
  "apollo.io": "Apollo.io",
  "apollo io": "Apollo.io",
  "apollo": "Apollo.io",
  "monday.com": "Monday.com",
  "monday com": "Monday.com",
  "copy.ai": "Copy.ai",
  "copy ai": "Copy.ai",
  "dbt labs": "dbt Labs",
  "dbt": "dbt Labs",
  "gmail com": "Google Workspace",
  "google workspace": "Google Workspace",
  "quickbooks online": "QuickBooks",
  "quickbooks": "QuickBooks",
  "perplexity": "Perplexity",
  "perplexity ai": "Perplexity",
  "perplexity official": "Perplexity",
  "perplexity pro": "Perplexity",
  "zendesk guide": "Zendesk",
  "zendesk": "Zendesk",
  "hubspot sales hub": "HubSpot",
  "hubspot landing": "HubSpot",
  "hubspot": "HubSpot",
  "atlassian status": "Atlassian",
  "atlassian": "Atlassian",
  "n8n cloud": "n8n",
  "n8n": "n8n",
  "clickup": "ClickUp",
  "heygen": "HeyGen",
  "elevenlabs": "ElevenLabs",
  "surveymonkey": "SurveyMonkey",
  "digitalocean": "DigitalOcean",
  "launchdarkly": "LaunchDarkly",
  "pagerduty": "PagerDuty",
  "knowledgeowl": "KnowledgeOwl",
  "productboard": "Productboard",
  "midjourney": "Midjourney",
  "runway ml": "Runway",
  "runway ai": "Runway",
  "runway": "Runway",
  "pika labs": "Pika",
  "pika": "Pika",
  "kling ai": "Kling AI",
  "suno ai": "Suno",
  "suno": "Suno",
  "otter ai": "Otter.ai",
  "fireflies ai": "Fireflies.ai",
  "leonardo ai": "Leonardo.ai",
  "adcreative ai": "AdCreative.ai",
  "jasper ai": "Jasper",
  "jasper": "Jasper",
  "play ht": "PlayHT",
  "playht": "PlayHT",
  "codeium": "Windsurf",
  "windsurf": "Windsurf",
  "bolt new": "Bolt.new",
  "lovable dev": "Lovable",
  "lovable": "Lovable",
  "make com": "Make",
  "make": "Make",
  "fly io": "Fly.io",
  "luma dream machine": "Luma",
  "salesforce sales cloud": "Salesforce",
  "salesforce agentforce": "Salesforce",
  "salesforce": "Salesforce",
  "openrouter": "OpenRouter",
  "deepseek": "DeepSeek",
  "linkedin premium company": "LinkedIn",
  "linkedin company": "LinkedIn",
  "linkedin sales navigator": "LinkedIn",
  "gohighlevel": "GoHighLevel",
  "highlevel": "GoHighLevel",
  "opstart accounting": "Opstart",
  "make.com": "Make",
  "atlassian status page": "Atlassian Statuspage",
  // Already in the DB from original seed — alias to skip them
  "notion": "Notion", "figma": "Figma", "datadog": "Datadog",
  "airtable": "Airtable", "canva": "Canva", "zapier": "Zapier",
  "slack": "Slack", "asana": "Asana", "calendly": "Calendly",
  "framer": "Framer", "stripe": "Stripe", "miro": "Miro",
  "shopify": "Shopify", "dropbox": "Dropbox", "zoom": "Zoom",
  "front": "Front", "harvest": "Harvest", "basecamp": "Basecamp",
  "intercom": "Intercom", "mixpanel": "Mixpanel", "mailchimp": "Mailchimp",
  "squarespace": "Squarespace", "freshworks": "Freshworks", "gusto": "Gusto",
  "postman": "Postman", "sentry": "Sentry", "mongodb": "MongoDB",
  "github": "GitHub", "gitlab": "GitLab", "segment": "Segment",
  "snyk": "Snyk", "cypress": "Cypress", "parsec": "Parsec",
  "tally": "Tally", "algolia": "Algolia", "gumlet": "Gumlet",
  "restream": "Restream", "auth0": "Auth0", "netlify": "Netlify",
  "new relic": "New Relic", "hashicorp": "HashiCorp", "fivetran": "Fivetran",
  "pulumi": "Pulumi", "tines": "Tines", "webflow": "Webflow",
  "typefully": "Typefully", "elastic": "Elastic", "databricks": "Databricks",
  "finta": "Finta", "peasy": "Peasy", "seamless ai": "Seamless AI",
}

// Domains to skip in Google results
const JUNK_DOMAINS = [
  "google.com", "youtube.com", "reddit.com", "wikipedia.org",
  "g2.com", "capterra.com", "trustradius.com", "producthunt.com",
  "crunchbase.com", "linkedin.com", "twitter.com", "x.com",
  "medium.com", "forbes.com", "techcrunch.com", "webcache.",
  "translate.google", "facebook.com/sharer",
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

function extractBrand(keyword: string): string | null {
  const kw = keyword.toLowerCase().trim()

  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(kw)) return null
  }

  if (!kw.includes("pricing")) return null

  const brand = kw
    .replace(/\s*pricing\s*page\s*/g, " ")
    .replace(/\s*pricing\s*/g, " ")
    .trim()

  if (!brand || brand.length < 2) return null

  const alias = BRAND_ALIASES[brand]
  if (alias) return alias

  // Title case
  return brand
    .split(/[\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

/**
 * Search Google for "{brand} pricing" and return the best pricing page URL.
 * Prioritizes results with /pricing, /plans, /prices in the path.
 * Validates that the result domain looks related to the brand.
 */
async function searchPricingUrl(
  brand: string,
  context: BrowserContext
): Promise<string | null> {
  const page = await context.newPage()
  try {
    // Search Google for the brand's pricing page
    const query = `${brand} pricing`
    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&num=10&hl=en`,
      { waitUntil: "domcontentloaded", timeout: 15_000 }
    )
    await page.waitForTimeout(2000)

    // Extract search result links
    const links = await page.evaluate((junkDomains: string[]) => {
      const results: string[] = []
      // Google organic results use various selectors; grab all <a> inside #search
      const anchors = document.querySelectorAll("#search a[href]")
      for (const a of anchors) {
        const href = (a as HTMLAnchorElement).href
        if (!href || !href.startsWith("http")) continue
        if (junkDomains.some((d) => href.includes(d))) continue
        // Deduplicate
        if (!results.includes(href)) results.push(href)
      }
      return results.slice(0, 10)
    }, JUNK_DOMAINS)

    if (links.length === 0) return null

    // 1) Best match: URL has /pricing, /plans, or /prices in path
    const pricingLink = links.find((url) =>
      /\/(pricing|plans|prices)(\/|$|\?)/i.test(url)
    )
    if (pricingLink) return pricingLink

    // 2) Fallback: first result that contains the brand name in the domain
    const brandWords = brand.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/)
    const mainWord = brandWords[0]
    if (mainWord && mainWord.length >= 3) {
      const domainMatch = links.find((url) => {
        try {
          const hostname = new URL(url).hostname.toLowerCase()
          return hostname.includes(mainWord)
        } catch {
          return false
        }
      })
      if (domainMatch) return domainMatch
    }

    return null
  } catch {
    return null
  } finally {
    if (!page.isClosed()) await page.close()
  }
}

async function captureScreenshot(
  url: string,
  slug: string,
  context: BrowserContext
): Promise<boolean> {
  const filepath = path.join(SCREENSHOTS_DIR, `${slug}.png`)
  if (fs.existsSync(filepath)) return true

  const page = await context.newPage()
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 })
    await page.waitForTimeout(3000)

    for (const selector of [
      '[id*="cookie"] button',
      '[class*="cookie"] button',
      'button:has-text("Accept")',
      'button:has-text("Got it")',
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
        // No banner
      }
    }

    await page.screenshot({ path: filepath, fullPage: true })
    return true
  } catch {
    return false
  } finally {
    if (!page.isClosed()) await page.close()
  }
}

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!)
  const db = drizzle(sqlClient)

  const existing = await db.select({ slug: companies.slug }).from(companies)
  const existingSlugs = new Set(existing.map((r) => r.slug))

  const raw = fs.readFileSync(CSV_PATH, "utf-8")
  const lines = raw.split("\n").filter((l) => l.trim())
  const [, ...rows] = lines

  const brandMap = new Map<string, { name: string; slug: string; volume: number }>()

  for (const line of rows) {
    const fields = parseCSVLine(line)
    const keyword = fields[1]
    const volume = parseInt(fields[4]) || 0
    if (!keyword) continue

    const brand = extractBrand(keyword)
    if (!brand) continue

    const slug = slugify(brand)
    if (existingSlugs.has(slug)) continue

    const prev = brandMap.get(slug)
    if (!prev || volume > prev.volume) {
      brandMap.set(slug, { name: brand, slug, volume })
    }
  }

  // Only import brands with search volume >= 50
  const newBrands = [...brandMap.values()]
    .filter((b) => b.volume >= 50)
    .sort((a, b) => b.volume - a.volume)

  console.log(`Found ${newBrands.length} new brands with volume >= 50 (${existingSlugs.size} already in DB)\n`)

  if (newBrands.length === 0) {
    console.log("Nothing to import!")
    return
  }

  for (const b of newBrands) {
    console.log(`  ${b.name} (${b.volume} vol)`)
  }
  console.log()

  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  let imported = 0
  let urlNotFound = 0

  for (const brand of newBrands) {
    process.stdout.write(`  ● ${brand.name} — `)

    const url = await searchPricingUrl(brand.name, context)
    if (!url) {
      console.log("✗ no pricing URL found")
      urlNotFound++
      // Delay even on failure to avoid Google rate-limiting
      await new Promise((r) => setTimeout(r, 3000))
      continue
    }
    process.stdout.write(`${url} — `)

    const screenshotOk = await captureScreenshot(url, brand.slug, context)
    const screenshotUrl = screenshotOk ? `/screenshots/${brand.slug}.png` : null

    await db.insert(companies).values({
      name: brand.name,
      slug: brand.slug,
      pageUrl: url,
      screenshotUrl,
    })

    console.log(screenshotOk ? "✓ imported + screenshot" : "✓ imported (no screenshot)")
    imported++

    // 3s delay between Google searches
    await new Promise((r) => setTimeout(r, 3000))
  }

  await browser.close()
  console.log(`\nDone: ${imported} imported, ${urlNotFound} URLs not found`)
}

main().catch(console.error)
