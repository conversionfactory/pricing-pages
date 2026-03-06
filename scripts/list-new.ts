import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies } from "../src/lib/schema"
import { asc, isNull } from "drizzle-orm"

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!))

  // New imports have no features/extras
  const all = await db
    .select({
      name: companies.name,
      slug: companies.slug,
      pageUrl: companies.pageUrl,
    })
    .from(companies)
    .where(isNull(companies.features))
    .orderBy(asc(companies.name))

  console.log(`New imports (no features/extras): ${all.length}\n`)
  for (const c of all) {
    console.log(`${c.slug} | ${c.name} | ${c.pageUrl || "NO URL"}`)
  }
}

main().catch(console.error)
