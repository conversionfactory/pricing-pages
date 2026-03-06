import Image from "next/image"
import Link from "next/link"
import type { Company } from "@/lib/queries"
import { FEATURES, EXTRAS, featureToSlug, extraToSlug } from "@/lib/tags"
import { TagBadge } from "./tag-badge"

type CompanyCardProps = {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const topFeatures = (company.features ?? []).slice(0, 3)
  const topExtras = (company.extras ?? []).slice(0, 2)

  return (
    <Link
      href={`/pricing/${company.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video w-full bg-muted">
        {company.screenshotUrl ? (
          <Image
            src={company.screenshotUrl}
            alt={`${company.name} pricing page screenshot`}
            fill
            className="object-cover object-top"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No screenshot yet
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {company.name}
          </h3>
          {company.tierCount && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {company.tierCount} {company.tierCount === 1 ? "tier" : "tiers"}
            </span>
          )}
        </div>
        {company.headline && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {company.headline}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {topFeatures.map((f) => {
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
          {topExtras.map((e) => {
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
    </Link>
  )
}
