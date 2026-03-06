import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies } from "./schema"
import fs from "fs"
import path from "path"

const tierMap: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
}

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

function parseCSVArray(value: string): string[] | null {
  if (!value) return null
  return value.split(",").map((s) => s.trim()).filter(Boolean)
}

async function seed() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql)

  const csvPath = path.resolve(__dirname, "../../data/seed.csv")
  const raw = fs.readFileSync(csvPath, "utf-8")
  const lines = raw.split("\n").filter((l) => l.trim())
  const [, ...rows] = lines // skip header

  const records = rows.map((line) => {
    const [name, pageUrl, headline, subtext, tiers, features, extras, notes] =
      parseCSVLine(line)

    return {
      name,
      slug: slugify(name),
      pageUrl: pageUrl || null,
      headline: headline || null,
      subtext: subtext || null,
      tierCount: tierMap[tiers?.toLowerCase()] ?? null,
      features: parseCSVArray(features),
      extras: parseCSVArray(extras),
      notes: notes || null,
    }
  }).filter((r) => r.name)

  // Clear existing data and insert
  await db.delete(companies)
  const inserted = await db.insert(companies).values(records).returning({ id: companies.id, name: companies.name })

  console.log(`Seeded ${inserted.length} companies`)
  for (const row of inserted) {
    console.log(`  - ${row.name}`)
  }
}

seed().catch(console.error)
