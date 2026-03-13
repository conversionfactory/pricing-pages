import type { Metadata } from "next"
import Link from "next/link"
import { ApplicationForm } from "@/components/application-form"

export const metadata: Metadata = {
  title: "Apply for a Pricing Page Revamp",
  description:
    "Tell us about your product and share your current pricing page. We'll review it and get back to you within one business day.",
}

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/revamp"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to service overview
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Apply for a Revamp</h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below and we&apos;ll review your pricing page before
          getting back to you — usually within one business day.
        </p>
      </div>

      <ApplicationForm />
    </div>
  )
}
