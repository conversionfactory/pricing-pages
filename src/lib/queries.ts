import { db } from "./db"
import { companies } from "./schema"
import { eq, arrayContains, asc, sql } from "drizzle-orm"
import { FEATURE_BY_SLUG, EXTRA_BY_SLUG } from "./tags"

export type Company = typeof companies.$inferSelect

export async function getAllCompanies(): Promise<Company[]> {
  return db.select().from(companies).orderBy(asc(companies.name))
}

export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  const results = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1)
  return results[0]
}

export async function getCompaniesByFeature(featureSlug: string): Promise<Company[]> {
  const meta = FEATURE_BY_SLUG[featureSlug]
  if (!meta) return []
  return db
    .select()
    .from(companies)
    .where(arrayContains(companies.features, [meta.canonical]))
    .orderBy(asc(companies.name))
}

export async function getCompaniesByExtra(extraSlug: string): Promise<Company[]> {
  const meta = EXTRA_BY_SLUG[extraSlug]
  if (!meta) return []
  return db
    .select()
    .from(companies)
    .where(arrayContains(companies.extras, [meta.canonical]))
    .orderBy(asc(companies.name))
}

export async function getCompaniesByTierCount(count: number): Promise<Company[]> {
  return db
    .select()
    .from(companies)
    .where(eq(companies.tierCount, count))
    .orderBy(asc(companies.name))
}

export async function getRelatedCompanies(
  company: Company,
  limit = 6
): Promise<Company[]> {
  // Find companies sharing features with the current company
  if (!company.features?.length) {
    // Fallback: just get some other companies
    const results = await db
      .select()
      .from(companies)
      .where(sql`${companies.slug} != ${company.slug}`)
      .orderBy(sql`random()`)
      .limit(limit)
    return results
  }

  const firstFeature = company.features[0]
  const results = await db
    .select()
    .from(companies)
    .where(
      sql`${companies.slug} != ${company.slug} AND ${companies.features} @> ARRAY[${firstFeature}]::text[]`
    )
    .orderBy(sql`random()`)
    .limit(limit)

  // If not enough results, fill with random companies
  if (results.length < limit) {
    const existingSlugs = [company.slug, ...results.map((r) => r.slug)]
    const filler = await db
      .select()
      .from(companies)
      .where(
        sql`${companies.slug} != ALL(ARRAY[${sql.join(existingSlugs.map((s) => sql`${s}`), sql`, `)}]::text[])`
      )
      .orderBy(sql`random()`)
      .limit(limit - results.length)
    results.push(...filler)
  }

  return results
}

export async function getDistinctTierCounts(): Promise<number[]> {
  const results = await db
    .selectDistinct({ tierCount: companies.tierCount })
    .from(companies)
    .where(sql`${companies.tierCount} IS NOT NULL`)
    .orderBy(asc(companies.tierCount))
  return results.map((r) => r.tierCount!).filter(Boolean)
}
