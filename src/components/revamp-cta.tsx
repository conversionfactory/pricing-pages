import Link from "next/link"

type Props = {
  heading: string
  body: string
  /** "sidebar" for compact vertical card, "banner" for full-width inline strip */
  variant?: "sidebar" | "banner"
}

export function RevampCta({ heading, body, variant = "sidebar" }: Props) {
  if (variant === "banner") {
    return (
      <div className="rounded-lg border bg-muted/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{heading}</p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
          <Link
            href="/revamp"
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Learn more →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold">{heading}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <Link
        href="/revamp"
        className="mt-3 block text-sm font-medium underline-offset-4 hover:underline"
      >
        See how it works →
      </Link>
    </div>
  )
}
