import Link from "next/link"
import { FEATURES, EXTRAS, TIER_COUNTS, TIER_LABELS } from "@/lib/tags"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold">PricingPages.com</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A curated directory of SaaS pricing page examples with screenshots
              and analysis.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Features</h3>
            <ul className="mt-2 space-y-1">
              {Object.values(FEATURES).map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/features/${f.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Extras</h3>
            <ul className="mt-2 space-y-1">
              {Object.values(EXTRAS).map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/extras/${e.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">By Tier Count</h3>
            <ul className="mt-2 space-y-1">
              {TIER_COUNTS.map((count) => (
                <li key={count}>
                  <Link
                    href={`/tiers/${count}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {TIER_LABELS[count]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PricingPages.com
        </div>
      </div>
    </footer>
  )
}
