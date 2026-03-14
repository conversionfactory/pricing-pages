export const PLATFORMS = [
  "Next.js",
  "Webflow",
  "Framer",
  "WordPress",
  "Shopify",
  "Squarespace",
  "Custom HTML/CSS",
  "Other",
] as const

export type Platform = (typeof PLATFORMS)[number]
