import type { Company } from "@/lib/queries"
import { CompanyCard } from "./company-card"

type CompanyGridProps = {
  companies: Company[]
}

export function CompanyGrid({ companies }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        No companies found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  )
}
