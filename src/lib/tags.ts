// Canonical feature/extra name → slug mappings + SEO descriptions

export type TagType = "feature" | "extra"

type TagMeta = {
  slug: string
  name: string
  description: string
}

export const FEATURES: Record<string, TagMeta> = {
  "Highlighted tier": {
    slug: "highlighted-tier",
    name: "Highlighted Tier",
    description: "Pricing pages that visually emphasize a recommended plan to guide buyers toward the best-value option.",
  },
  "Free trial (then pay)": {
    slug: "free-trial",
    name: "Free Trial",
    description: "Pricing pages offering a free trial period before requiring payment, reducing signup friction.",
  },
  "Calculator or slider": {
    slug: "calculator-or-slider",
    name: "Calculator or Slider",
    description: "Pricing pages with interactive calculators or sliders that let visitors estimate costs based on usage.",
  },
  "Free tier": {
    slug: "free-tier",
    name: "Free Tier",
    description: "Pricing pages that include a permanently free plan alongside paid options.",
  },
  "Enterprise tier": {
    slug: "enterprise-tier",
    name: "Enterprise Tier",
    description: "Pricing pages featuring a dedicated enterprise plan with custom pricing or contact-sales CTAs.",
  },
  "Hidden prices": {
    slug: "hidden-prices",
    name: "Hidden Prices",
    description: "Pricing pages that don't show exact dollar amounts, requiring visitors to contact sales or sign up.",
  },
  "Monthly Yearly toggle": {
    slug: "monthly-yearly-toggle",
    name: "Monthly/Yearly Toggle",
    description: "Pricing pages with a toggle switch to compare monthly vs. annual billing, often showing annual discounts.",
  },
  "More info tooltips": {
    slug: "more-info-tooltips",
    name: "More Info Tooltips",
    description: "Pricing pages using tooltip hovers to explain features without cluttering the layout.",
  },
  "Add-ons": {
    slug: "add-ons",
    name: "Add-ons",
    description: "Pricing pages that offer additional purchasable modules or features on top of base plans.",
  },
  "Sticky header on scroll": {
    slug: "sticky-header",
    name: "Sticky Header on Scroll",
    description: "Pricing pages where the plan names or CTAs stay fixed at the top as users scroll through feature comparisons.",
  },
  "Feature comparison rows": {
    slug: "feature-comparison",
    name: "Feature Comparison Rows",
    description: "Pricing pages with detailed row-by-row feature comparison tables across plans.",
  },
}

export const EXTRAS: Record<string, TagMeta> = {
  "Testimonials": {
    slug: "testimonials",
    name: "Testimonials",
    description: "Pricing pages that include customer testimonials to build trust and reduce purchase hesitation.",
  },
  "Customer logos": {
    slug: "customer-logos",
    name: "Customer Logos",
    description: "Pricing pages displaying recognizable customer logos as social proof.",
  },
  "FAQs": {
    slug: "faqs",
    name: "FAQs",
    description: "Pricing pages with a frequently asked questions section to address common objections.",
  },
  "Ratings": {
    slug: "ratings",
    name: "Ratings",
    description: "Pricing pages showing third-party review ratings (G2, Capterra, etc.) for credibility.",
  },
  "Email capture onboarding": {
    slug: "email-capture",
    name: "Email Capture Onboarding",
    description: "Pricing pages that gate access behind an email capture form as part of onboarding.",
  },
  "Bento Grid": {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "Pricing pages using a bento grid layout to showcase features in a visually engaging way.",
  },
  "Awards": {
    slug: "awards",
    name: "Awards",
    description: "Pricing pages that display industry awards and recognition badges.",
  },
  "Chat in corner": {
    slug: "chat-widget",
    name: "Chat Widget",
    description: "Pricing pages with a live chat widget for instant sales or support questions.",
  },
  "Credit card logos": {
    slug: "credit-card-logos",
    name: "Credit Card Logos",
    description: "Pricing pages showing accepted payment method logos to build payment trust.",
  },
  "Custom quote": {
    slug: "custom-quote",
    name: "Custom Quote",
    description: "Pricing pages offering a custom quote option for tailored enterprise or volume pricing.",
  },
  "Newsletter sign up form": {
    slug: "newsletter-signup",
    name: "Newsletter Sign Up",
    description: "Pricing pages that include a newsletter signup form to capture leads.",
  },
}

export const TIER_COUNTS = [1, 2, 3, 4, 5] as const

export const TIER_LABELS: Record<number, string> = {
  1: "One Tier",
  2: "Two Tiers",
  3: "Three Tiers",
  4: "Four Tiers",
  5: "Five Tiers",
}

export const TIER_DESCRIPTIONS: Record<number, string> = {
  1: "Pricing pages with a single plan — simple, take-it-or-leave-it pricing.",
  2: "Pricing pages with two tiers — typically a free/starter plan and a paid plan.",
  3: "Pricing pages with three tiers — the classic good/better/best pricing structure.",
  4: "Pricing pages with four tiers — offering more granularity for different team sizes.",
  5: "Pricing pages with five tiers — comprehensive options from free to enterprise.",
}

// Reverse lookups: slug → canonical name
export const FEATURE_BY_SLUG: Record<string, TagMeta & { canonical: string }> = {}
for (const [canonical, meta] of Object.entries(FEATURES)) {
  FEATURE_BY_SLUG[meta.slug] = { ...meta, canonical }
}

export const EXTRA_BY_SLUG: Record<string, TagMeta & { canonical: string }> = {}
for (const [canonical, meta] of Object.entries(EXTRAS)) {
  EXTRA_BY_SLUG[meta.slug] = { ...meta, canonical }
}

export function featureToSlug(feature: string): string | null {
  return FEATURES[feature]?.slug ?? null
}

export function extraToSlug(extra: string): string | null {
  return EXTRAS[extra]?.slug ?? null
}
