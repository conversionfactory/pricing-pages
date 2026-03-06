// Dry run: just show what brands would be imported, no network calls
import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies } from "../src/lib/schema"
import fs from "fs"
import path from "path"

const CSV_PATH = process.argv[2] || path.resolve(
  process.env.HOME!,
  "Downloads/google_us_pricing-page_matching-terms_2026-03-06_00-15-34 - Sheet1.csv"
)

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
  /amazon /i, /^aws /i, /^azure /i, /^google cloud/i,
  /cloudflare \w/i, /company[_ ]/i, /genai/i,
  /^openai /i, /^chatgpt /i, /^anthropic /i, /^deepseek /i,
  /\bapi\b/i, / pro\b/i, / plus\b/i, / product\b/i,
  / premium\b/i, / navigator\b/i, / hub\b/i,
  /^linkedin/i, /gmail/i, /^salesforce /i,
]

const BRAND_ALIASES: Record<string, string> = {
  "openai api": "OpenAI", "openai chatgpt": "OpenAI", "chatgpt": "OpenAI",
  "openai": "OpenAI", "openai platform": "OpenAI",
  "anthropic claude": "Anthropic", "anthropic api": "Anthropic",
  "anthropic": "Anthropic", "claude": "Anthropic", "claude ai": "Anthropic",
  "github copilot": "GitHub Copilot",
  "cursor ide": "Cursor", "cursor ai": "Cursor", "cursor editor": "Cursor",
  "cursor ai editor": "Cursor", "cursor ai code editor": "Cursor", "cursor": "Cursor",
  "apollo.io": "Apollo.io", "apollo io": "Apollo.io", "apollo": "Apollo.io",
  "monday.com": "Monday.com", "monday com": "Monday.com",
  "copy.ai": "Copy.ai", "copy ai": "Copy.ai",
  "dbt labs": "dbt Labs", "dbt": "dbt Labs",
  "gmail com": "Google Workspace", "google workspace": "Google Workspace",
  "quickbooks online": "QuickBooks", "quickbooks": "QuickBooks",
  "perplexity": "Perplexity", "perplexity ai": "Perplexity",
  "perplexity official": "Perplexity", "perplexity pro": "Perplexity",
  "zendesk guide": "Zendesk", "zendesk": "Zendesk",
  "hubspot sales hub": "HubSpot", "hubspot landing": "HubSpot", "hubspot": "HubSpot",
  "atlassian status": "Atlassian", "atlassian": "Atlassian",
  "n8n cloud": "n8n", "n8n": "n8n",
  "clickup": "ClickUp", "heygen": "HeyGen", "elevenlabs": "ElevenLabs",
  "surveymonkey": "SurveyMonkey", "digitalocean": "DigitalOcean",
  "launchdarkly": "LaunchDarkly", "pagerduty": "PagerDuty",
  "knowledgeowl": "KnowledgeOwl", "productboard": "Productboard",
  "midjourney": "Midjourney",
  "runway ml": "Runway", "runway ai": "Runway", "runway": "Runway",
  "pika labs": "Pika", "pika": "Pika",
  "kling ai": "Kling AI", "suno ai": "Suno", "suno": "Suno",
  "otter ai": "Otter.ai", "fireflies ai": "Fireflies.ai",
  "leonardo ai": "Leonardo.ai", "adcreative ai": "AdCreative.ai",
  "jasper ai": "Jasper", "jasper": "Jasper",
  "play ht": "PlayHT", "playht": "PlayHT",
  "codeium": "Windsurf", "windsurf": "Windsurf",
  "bolt new": "Bolt.new", "lovable dev": "Lovable", "lovable": "Lovable",
  "make com": "Make", "make": "Make",
  "fly io": "Fly.io", "luma dream machine": "Luma",
  "salesforce sales cloud": "Salesforce", "salesforce agentforce": "Salesforce", "salesforce": "Salesforce",
  "openrouter": "OpenRouter", "deepseek": "DeepSeek",
  "linkedin premium company": "LinkedIn", "linkedin company": "LinkedIn",
  "linkedin sales navigator": "LinkedIn",
  "gohighlevel": "GoHighLevel", "highlevel": "GoHighLevel",
  "opstart accounting": "Opstart", "make.com": "Make",
  "atlassian status page": "Atlassian Statuspage",
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

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim()); current = ""
    } else current += char
  }
  fields.push(current.trim())
  return fields
}

function extractBrand(keyword: string): string | null {
  const kw = keyword.toLowerCase().trim()
  for (const p of SKIP_PATTERNS) { if (p.test(kw)) return null }
  if (!kw.includes("pricing")) return null
  let brand = kw.replace(/\s*pricing\s*page\s*/g, " ").replace(/\s*pricing\s*/g, " ").trim()
  if (!brand || brand.length < 2) return null
  const alias = BRAND_ALIASES[brand]
  if (alias) return alias
  return brand.split(/[\s]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!))
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
    if (!prev || volume > prev.volume) brandMap.set(slug, { name: brand, slug, volume })
  }

  const newBrands = [...brandMap.values()]
    .filter((b) => b.volume >= 50)
    .sort((a, b) => b.volume - a.volume)

  console.log(`${existingSlugs.size} already in DB`)
  console.log(`${newBrands.length} new brands with volume >= 50:\n`)
  for (const b of newBrands) {
    console.log(`  ${b.name} (${b.slug}) — vol: ${b.volume}`)
  }
}

main().catch(console.error)
