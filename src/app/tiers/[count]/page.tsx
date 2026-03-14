import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCompaniesByTierCount } from "@/lib/queries"
import { TIER_COUNTS, TIER_LABELS, TIER_DESCRIPTIONS } from "@/lib/tags"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageHeader } from "@/components/page-header"
import { CompanyGrid } from "@/components/company-grid"
import { JsonLd } from "@/components/json-ld"
import { RevampCta } from "@/components/revamp-cta"

type Props = {
  params: Promise<{ count: string }>
}

export async function generateStaticParams() {
  return TIER_COUNTS.map((c) => ({ count: String(c) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { count } = await params
  const num = parseInt(count, 10)
  const label = TIER_LABELS[num]
  const description = TIER_DESCRIPTIONS[num]
  if (!label) return {}

  return {
    title: `Pricing Pages with ${label}`,
    description,
    openGraph: {
      title: `Pricing Pages with ${label}`,
      description,
      url: `/tiers/${count}`,
    },
  }
}

export default async function TierPage({ params }: Props) {
  const { count } = await params
  const num = parseInt(count, 10)
  const label = TIER_LABELS[num]
  const description = TIER_DESCRIPTIONS[num]
  if (!label) notFound()

  const companies = await getCompaniesByTierCount(num)

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Pricing Pages with ${label}`,
    url: `https://pricingpages.com/tiers/${count}`,
    description,
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pricingpages.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tiers",
        item: "https://pricingpages.com",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: label,
        item: `https://pricingpages.com/tiers/${count}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={collectionPage} />
      <JsonLd data={breadcrumbList} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Tiers", href: "/#tiers" },
            { label },
          ]}
        />
        <div className="mt-8">
          <PageHeader
            title={`Pricing Pages with ${label}`}
            subtitle={description}
            count={companies.length}
          />
        </div>
        <div className="mt-8">
          <CompanyGrid companies={companies} />
        </div>
        <div className="mt-12">
          <RevampCta
            variant="banner"
            heading="Not sure how many tiers are right for your product?"
            body="We'll figure it out — pricing strategy, tier structure, copy, design, and implementation all included."
          />
        </div>
      </div>
    </>
  )
}
