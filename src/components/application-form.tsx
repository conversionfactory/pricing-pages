"use client"

import { useActionState } from "react"
import { submitApplication } from "@/actions/submit-application"

const PLATFORMS = [
  "Next.js",
  "Webflow",
  "Framer",
  "WordPress",
  "Shopify",
  "Squarespace",
  "Custom HTML/CSS",
  "Other",
]

export function ApplicationForm() {
  const [state, action, isPending] = useActionState(submitApplication, null)

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Your name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-50"
            placeholder="Jane Smith"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Work email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-50"
            placeholder="jane@company.com"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="company" className="text-sm font-medium">
          Company name <span className="text-destructive">*</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          required
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-50"
          placeholder="Acme Inc."
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="pricingPageUrl" className="text-sm font-medium">
          Your current pricing page URL <span className="text-destructive">*</span>
        </label>
        <input
          id="pricingPageUrl"
          name="pricingPageUrl"
          type="url"
          required
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-50"
          placeholder="https://yourcompany.com/pricing"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="platform" className="text-sm font-medium">
          Platform / framework
        </label>
        <select
          id="platform"
          name="platform"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring/50 focus:ring-2 disabled:opacity-50"
          disabled={isPending}
          defaultValue=""
        >
          <option value="" disabled>
            Select your platform…
          </option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="goal" className="text-sm font-medium">
          What&apos;s your biggest goal for this revamp?
        </label>
        <textarea
          id="goal"
          name="goal"
          rows={4}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-50"
          placeholder="e.g. We're getting traffic but very few trial signups. We think our pricing structure is confusing…"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit Application →"}
      </button>
    </form>
  )
}
