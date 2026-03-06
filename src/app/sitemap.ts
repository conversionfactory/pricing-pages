import type { MetadataRoute } from "next"
import { getAllCompanies } from "@/lib/queries"
import { FEATURES, EXTRAS, TIER_COUNTS } from "@/lib/tags"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await getAllCompanies()
  const baseUrl = "https://pricingpages.com"

  const companyPages = companies.map((c) => ({
    url: `${baseUrl}/pricing/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const featurePages = Object.values(FEATURES).map((f) => ({
    url: `${baseUrl}/features/${f.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const extraPages = Object.values(EXTRAS).map((e) => ({
    url: `${baseUrl}/extras/${e.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const tierPages = TIER_COUNTS.map((count) => ({
    url: `${baseUrl}/tiers/${count}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...companyPages,
    ...featurePages,
    ...extraPages,
    ...tierPages,
  ]
}
