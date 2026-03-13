import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCompaniesByExtra } from "@/lib/queries"
import { EXTRAS, EXTRA_BY_SLUG } from "@/lib/tags"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageHeader } from "@/components/page-header"
import { CompanyGrid } from "@/components/company-grid"
import { JsonLd } from "@/components/json-ld"
import { RevampCta } from "@/components/revamp-cta"

type Props = {
  params: Promise<{ extraSlug: string }>
}

export async function generateStaticParams() {
  return Object.values(EXTRAS).map((e) => ({ extraSlug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { extraSlug } = await params
  const meta = EXTRA_BY_SLUG[extraSlug]
  if (!meta) return {}

  return {
    title: `Pricing Pages with ${meta.name}`,
    description: meta.description,
    openGraph: {
      title: `Pricing Pages with ${meta.name}`,
      description: meta.description,
      url: `/extras/${extraSlug}`,
    },
  }
}

export default async function ExtraPage({ params }: Props) {
  const { extraSlug } = await params
  const meta = EXTRA_BY_SLUG[extraSlug]
  if (!meta) notFound()

  const companies = await getCompaniesByExtra(extraSlug)

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Pricing Pages with ${meta.name}`,
    url: `https://pricingpages.com/extras/${extraSlug}`,
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
        name: "Extras",
        item: "https://pricingpages.com",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.name,
        item: `https://pricingpages.com/extras/${extraSlug}`,
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
            { label: "Extras", href: "/#extras" },
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
        <div className="mt-12">
          <RevampCta
            variant="banner"
            heading={`Want ${meta.name} on your pricing page?`}
            body="We add it — strategy, copy, design, and implementation all included."
          />
        </div>
      </div>
    </>
  )
}
