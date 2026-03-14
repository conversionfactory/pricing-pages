"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { applications } from "@/lib/schema"
import { PLATFORMS } from "@/lib/constants"

type FormState = { error: string } | null

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Please enter a valid email address").max(200),
  company: z.string().min(1, "Company name is required").max(200),
  pricingPageUrl: z
    .string()
    .url("Please enter a valid URL for your pricing page")
    .max(500),
  platform: z
    .preprocess((v) => (v === "" ? undefined : v), z.enum(PLATFORMS).optional())
    .optional(),
  goal: z.string().max(2000).optional(),
})

export async function submitApplication(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Rate limit by IP — max 3 submissions per hour
  const headersList = await headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  const recentCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(applications)
    .where(
      sql`${applications.ipAddress} = ${ip} AND ${applications.createdAt} > NOW() - INTERVAL '1 hour'`
    )

  if ((recentCount[0]?.count ?? 0) >= 3) {
    return { error: "Too many submissions. Please try again in an hour." }
  }

  // Validate with Zod
  const result = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    pricingPageUrl: formData.get("pricingPageUrl"),
    platform: formData.get("platform"),
    goal: formData.get("goal"),
  })

  if (!result.success) {
    const firstError = result.error.issues[0]
    return { error: firstError?.message ?? "Please check the form and try again." }
  }

  const { name, email, company, pricingPageUrl, platform, goal } = result.data

  await db.insert(applications).values({
    name,
    email,
    company,
    pricingPageUrl,
    platform: platform ?? null,
    goal: goal ?? null,
    ipAddress: ip,
  })

  redirect("/revamp/thank-you?submitted=1")
}
