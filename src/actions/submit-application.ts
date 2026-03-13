"use server"

import { db } from "@/lib/db"
import { applications } from "@/lib/schema"
import { redirect } from "next/navigation"

type FormState = { error: string } | null

export async function submitApplication(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const pricingPageUrl = formData.get("pricingPageUrl") as string
  const platform = formData.get("platform") as string
  const goal = formData.get("goal") as string

  if (!name || !email || !company || !pricingPageUrl) {
    return { error: "Please fill in all required fields." }
  }

  try {
    new URL(pricingPageUrl)
  } catch {
    return { error: "Please enter a valid URL for your pricing page." }
  }

  await db.insert(applications).values({
    name,
    email,
    company,
    pricingPageUrl,
    platform: platform || null,
    goal: goal || null,
  })

  redirect("/revamp/thank-you")
}
