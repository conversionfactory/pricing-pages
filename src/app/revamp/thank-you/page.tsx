import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false },
}

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 sm:px-6 lg:px-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />

      <h1 className="mt-6 text-3xl font-bold">Application received</h1>
      <p className="mt-3 text-muted-foreground">
        We&apos;ll review your pricing page and get back to you within one business
        day. In the meantime, choose how you&apos;d like to move forward:
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Book a call */}
        <div className="rounded-lg border p-6 text-left">
          <p className="font-semibold">Book a strategy call</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Jump on a 30-minute call to walk through your current page and our
            initial thoughts.
          </p>
          <a
            href="#"
            className="mt-4 block rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted"
          >
            Schedule a call →
          </a>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Calendly link coming soon
          </p>
        </div>

        {/* Pay now */}
        <div className="rounded-lg border bg-primary p-6 text-left text-primary-foreground">
          <p className="font-semibold">Ready to get started?</p>
          <p className="mt-1.5 text-sm opacity-80">
            Skip the call and pay now. We&apos;ll kick off as soon as payment is
            confirmed.
          </p>
          <a
            href="#"
            className="mt-4 block rounded-lg bg-primary-foreground px-4 py-2.5 text-center text-sm font-medium text-primary transition-opacity hover:opacity-90"
          >
            Pay $3,000 →
          </a>
          <p className="mt-2 text-center text-xs opacity-60">
            Stripe checkout coming soon
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Questions?{" "}
        <Link
          href="/revamp"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Review the service details
        </Link>{" "}
        or browse{" "}
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-foreground"
        >
          pricing page examples
        </Link>{" "}
        while you wait.
      </p>
    </div>
  )
}
