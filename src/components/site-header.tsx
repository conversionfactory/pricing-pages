import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold">
          PricingPages.com
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#extras"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Extras
          </Link>
          <Link
            href="/#tiers"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Tiers
          </Link>
        </nav>
      </div>
    </header>
  )
}
