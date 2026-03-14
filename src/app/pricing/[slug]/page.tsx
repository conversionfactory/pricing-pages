import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllCompanies, getCompanyBySlug, getRelatedCompanies } from "@/lib/queries"
import { FEATURES, EXTRAS, featureToSlug, extraToSlug, TIER_LABELS } from "@/lib/tags"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { TagBadge } from "@/components/tag-badge"
import { RelatedPages } from "@/components/related-pages"
import { JsonLd } from "@/components/json-ld"
import { RevampCta } from "@/components/revamp-cta"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const companies = await getAllCompanies()
  return companies.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  if (!company) return {}

  return {
    title: `${company.name} Pricing Page`,
    description: `See ${company.name}'s pricing page design — ${company.tierCount ? `${company.tierCount} tiers` : "pricing details"}, features, and screenshots. Get inspiration for your own pricing page.`,
    openGraph: {
      title: `${company.name} Pricing Page`,
      description: `Explore ${company.name}'s pricing page with screenshots and analysis.`,
      url: `/pricing/${company.slug}`,
    },
  }
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  if (!company) notFound()

  const related = await getRelatedCompanies(company)

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
        name: `${company.name} Pricing`,
        item: `https://pricingpages.com/pricing/${company.slug}`,
      },
    ],
  }

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${company.name} Pricing Page`,
    url: `https://pricingpages.com/pricing/${company.slug}`,
    description: `Analysis of ${company.name}'s pricing page design.`,
    isPartOf: {
      "@type": "WebSite",
      name: "PricingPages.com",
      url: "https://pricingpages.com",
    },
  }

  return (
    <>
      <JsonLd data={breadcrumbList} />
      <JsonLd data={webPage} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: company.name }]} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Screenshot */}
          <div className="relative overflow-hidden rounded-lg border bg-muted">
            {company.screenshotUrl ? (
              <Image
                src={company.screenshotUrl}
                alt={`${company.name} pricing page screenshot`}
                width={1200}
                height={800}
                className="w-full"
                unoptimized
                priority
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-muted-foreground">
                No screenshot yet
              </div>
            )}
          </div>

          {/* Details sidebar */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{company.name} Pricing Page</h1>
              {company.headline && (
                <p className="mt-2 text-lg text-muted-foreground">
                  &ldquo;{company.headline}&rdquo;
                </p>
              )}
              {company.subtext && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {company.subtext}
                </p>
              )}
            </div>

            {/* Metadata panel */}
            <div className="rounded-lg border p-4 space-y-3">
              {company.tierCount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiers</span>
                  <Link
                    href={`/tiers/${company.tierCount}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {TIER_LABELS[company.tierCount] ?? `${company.tierCount} tiers`}
                  </Link>
                </div>
              )}
              {company.pageUrl && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Live page</span>
                  <a
                    href={company.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    Visit &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Features */}
            {company.features && company.features.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Features
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {company.features.map((f) => {
                    const slug = featureToSlug(f)
                    const meta = FEATURES[f]
                    if (!slug || !meta) return null
                    return (
                      <TagBadge
                        key={f}
                        label={meta.name}
                        href={`/features/${slug}`}
                        variant="feature"
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Extras */}
            {company.extras && company.extras.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Extras
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {company.extras.map((e) => {
                    const slug = extraToSlug(e)
                    const meta = EXTRAS[e]
                    if (!slug || !meta) return null
                    return (
                      <TagBadge
                        key={e}
                        label={meta.name}
                        href={`/extras/${slug}`}
                        variant="extra"
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            {company.notes && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Notes
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {company.notes}
                </p>
              </div>
            )}

            <RevampCta
              heading="Want a pricing page like this for your product?"
              body="We handle strategy, copy, design, and implementation — built on insights from hundreds of real SaaS pricing pages."
            />
          </div>
        </div>

        {/* Related companies */}
        <div className="mt-12">
          <RelatedPages companies={related} />
        </div>
      </div>
    </>
  )
}
