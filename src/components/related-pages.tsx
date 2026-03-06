import Link from "next/link"
import type { Company } from "@/lib/queries"

type RelatedPagesProps = {
  companies: Company[]
  title?: string
}

export function RelatedPages({
  companies,
  title = "Related Pricing Pages",
}: RelatedPagesProps) {
  if (companies.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {companies.map((c) => (
          <Link
            key={c.id}
            href={`/pricing/${c.slug}`}
            className="rounded-lg border p-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
