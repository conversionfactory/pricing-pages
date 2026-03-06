import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies } from "../src/lib/schema"
import { inArray } from "drizzle-orm"
import fs from "fs"
import path from "path"

const SCREENSHOTS_DIR = path.resolve(__dirname, "../public/screenshots")

// Spam domains, wrong companies, duplicates, homepage-only results
const BAD_SLUGS = [
  "anthropic-claude",     // spam domain (anthropic-claude.com)
  "aws-bedrock",          // spam domain (aws-bedrock.com)
  "aws-certification-exam", // spam domain
  "chatgpt-openai",       // duplicate, landed on chatgpt.com homepage
  "company-name",         // fake test domain
  "cursor-ai",            // spam domain (cursor-ai.com, real is cursor.com)
  "design-template",      // generic/spam domain
  "facebook",             // not a SaaS pricing page
  "gemini",               // wrong company (servicesbygemini.com, not Google Gemini)
  "generator",            // wrong company (powersecure.com)
  "genspark",             // login redirect URL, not pricing
  "gmail-com",            // duplicate of google-workspace
  "jasper-ai",            // spam domain (real is jasper.ai)
  "linear",               // wrong URL (analog.com, real is linear.app)
  "not-found",            // literal nonsense domain
  "notion-ai",            // spam domain (real is notion.so)
  "openphone",            // wrong URL (quo.com, real is openphone.com)
  "opusclip",             // got redirect URL, not actual page
  "otter-ai",             // spam domain (real is otter.ai)
  "pika-labs",            // spam domain (real is pika.art)
  "pictory",              // landed on homepage, not pricing
  "pictory-ai",           // spam domain
  "playground-ai",        // spam domain
  "proton-vpn",           // spam domain (real is protonvpn.com)
  "suno-ai",              // spam domain, duplicate of suno
  "templates",            // generic domain
  "shadcn",               // not a SaaS product (shadcn.io is not real shadcn)
  "apollo",               // duplicate of apollo-io
  "runwayml",             // duplicate of runway
  "clearbit",             // landed on homepage
  "datarobot",            // landed on homepage
  "drata",                // landed on homepage
  "jira",                 // duplicate of atlassian entry
  "jobber",               // landed on homepage (getjobber.com)
  "softr",                // landed on homepage
  "sprout-social",        // landed on homepage
  "veed",                 // landed on homepage
  "coursera",             // landed on homepage
  "fal-ai",               // spam domain (real is fal.ai)
]

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!))

  // Delete bad entries
  const deleted = await db
    .delete(companies)
    .where(inArray(companies.slug, BAD_SLUGS))
    .returning({ slug: companies.slug, name: companies.name })

  console.log(`Deleted ${deleted.length} bad entries:`)
  for (const d of deleted) {
    console.log(`  - ${d.name} (${d.slug})`)
    // Also remove screenshot file if exists
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${d.slug}.png`)
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath)
      console.log(`    removed screenshot`)
    }
  }

  // Count remaining
  const remaining = await db.select({ slug: companies.slug }).from(companies)
  console.log(`\n${remaining.length} companies remaining in DB`)
}

main().catch(console.error)
