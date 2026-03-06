import Link from "next/link"
import { cn } from "@/lib/utils"

type TagBadgeProps = {
  label: string
  href: string
  variant?: "feature" | "extra"
}

export function TagBadge({ label, href, variant = "feature" }: TagBadgeProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80",
        variant === "feature"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </Link>
  )
}
