import Link from "next/link"
import { getAllCompanies } from "@/lib/queries"
import { FEATURES, EXTRAS, TIER_COUNTS, TIER_LABELS } from "@/lib/tags"
import { CompanyGrid } from "@/components/company-grid"
import { PageHeader } from "@/components/page-header"
import { JsonLd } from "@/components/json-ld"
import { RevampCta } from "@/components/revamp-cta"

export default async function HomePage() {
  const companies = await getAllCompanies()

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PricingPages.com",
          url: "https://pricingpages.com",
          description:
            "A curated directory of SaaS pricing page examples with screenshots and analysis.",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="SaaS Pricing Page Examples"
          subtitle="Browse real pricing pages with screenshots, features, and design analysis. Find inspiration for your next pricing page."
          count={companies.length}
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_240px]">
          <CompanyGrid companies={companies} />

          <aside className="space-y-8">
            <div id="features">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Browse by Feature
              </h2>
              <ul className="mt-3 space-y-1">
                {Object.values(FEATURES).map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/features/${f.slug}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div id="extras">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Browse by Extra
              </h2>
              <ul className="mt-3 space-y-1">
                {Object.values(EXTRAS).map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/extras/${e.slug}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {e.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div id="tiers">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Browse by Tier Count
              </h2>
              <ul className="mt-3 space-y-1">
                {TIER_COUNTS.map((count) => (
                  <li key={count}>
                    <Link
                      href={`/tiers/${count}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {TIER_LABELS[count]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <RevampCta
              heading="Is your pricing page converting?"
              body="We rebuild SaaS pricing pages from the ground up — strategy, copy, design, and implementation."
            />
          </aside>
        </div>
      </div>
    </>
  )
}
