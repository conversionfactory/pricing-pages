import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCompaniesByFeature } from "@/lib/queries"
import { FEATURES, FEATURE_BY_SLUG } from "@/lib/tags"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageHeader } from "@/components/page-header"
import { CompanyGrid } from "@/components/company-grid"
import { JsonLd } from "@/components/json-ld"

type Props = {
  params: Promise<{ featureSlug: string }>
}

export async function generateStaticParams() {
  return Object.values(FEATURES).map((f) => ({ featureSlug: f.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { featureSlug } = await params
  const meta = FEATURE_BY_SLUG[featureSlug]
  if (!meta) return {}

  return {
    title: `Pricing Pages with ${meta.name}`,
    description: meta.description,
    openGraph: {
      title: `Pricing Pages with ${meta.name}`,
      description: meta.description,
      url: `/features/${featureSlug}`,
    },
  }
}

export default async function FeaturePage({ params }: Props) {
  const { featureSlug } = await params
  const meta = FEATURE_BY_SLUG[featureSlug]
  if (!meta) notFound()

  const companies = await getCompaniesByFeature(featureSlug)

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Pricing Pages with ${meta.name}`,
    url: `https://pricingpages.com/features/${featureSlug}`,
    description: meta.description,
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
        name: "Features",
        item: "https://pricingpages.com",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.name,
        item: `https://pricingpages.com/features/${featureSlug}`,
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
            { label: "Features", href: "/#features" },
            { label: meta.name },
          ]}
        />
        <div className="mt-8">
          <PageHeader
            title={`Pricing Pages with ${meta.name}`}
            subtitle={meta.description}
            count={companies.length}
          />
        </div>
        <div className="mt-8">
          <CompanyGrid companies={companies} />
        </div>
      </div>
    </>
  )
}
