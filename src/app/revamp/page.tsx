import type { Metadata } from "next"
import Link from "next/link"
import {
  Search,
  PenLine,
  Layers,
  Palette,
  Code2,
  FlaskConical,
  BarChart3,
  CheckCircle2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing Page Revamp Service",
  description:
    "We rebuild your SaaS pricing page from the ground up — strategy, copy, design, implementation, A/B testing, and analytics. $3,000 flat.",
}

const DELIVERABLES = [
  {
    icon: Search,
    title: "Conversion Audit",
    description:
      "A full teardown of your current page — what's hurting conversions, what's working, and exactly what needs to change.",
  },
  {
    icon: Layers,
    title: "Pricing Strategy",
    description:
      "Tier structure, naming, positioning, and anchoring — engineered to guide visitors toward the right plan.",
  },
  {
    icon: PenLine,
    title: "Copywriting",
    description:
      "Every word rewritten: headline, subtext, tier names, feature descriptions, FAQs, and CTAs.",
  },
  {
    icon: Palette,
    title: "Design",
    description:
      "A Figma mockup optimized for clarity and conversion — layouts, hierarchy, and visual cues that move visitors forward.",
  },
  {
    icon: Code2,
    title: "Implementation",
    description:
      "Built directly into your stack. We support Next.js, Webflow, Framer, and more. No hand-off friction.",
  },
  {
    icon: FlaskConical,
    title: "A/B Testing + Analytics",
    description:
      "Experiment setup and conversion tracking configured so you can measure the lift and keep improving.",
  },
]

const INCLUDED = [
  "Full conversion audit",
  "Pricing strategy & tier structure",
  "New copy — every word",
  "Figma design mockup",
  "Web implementation",
  "A/B test setup",
  "Analytics & conversion tracking",
  "Revisions until you're happy",
]

const FAQS = [
  {
    q: "Who is this for?",
    a: "SaaS companies with an existing pricing page that isn't converting as well as it should. If you're getting traffic but struggling to turn visitors into trial signups or customers, this is for you.",
  },
  {
    q: "What platforms do you support for implementation?",
    a: "Next.js, Webflow, Framer, and custom HTML/CSS. If your stack isn't listed, reach out and we'll let you know — we can often accommodate.",
  },
  {
    q: "How long does it take?",
    a: "Typically 2 weeks from kickoff to delivery. The audit and strategy come first, then copy, design, and implementation.",
  },
  {
    q: "Do I need to get on a call?",
    a: "No — but we offer an optional strategy call after you apply. Some clients prefer async; others find a call helps. Either way works.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "We iterate until you are. The goal is a pricing page you're genuinely proud of.",
  },
]

export default function RevampPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-block rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Productized Service
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Your pricing page is losing you customers.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We rebuild it from the ground up — strategy, copy, design, and
          implementation — built on insights from hundreds of real SaaS pricing
          pages.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/revamp/apply"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Apply for a Revamp →
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse pricing page examples first
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* Problem */}
      <div>
        <h2 className="text-2xl font-bold">Why most pricing pages underperform</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              heading: "Visitors leave confused",
              body: "Vague value propositions and unclear tier differences mean visitors can't figure out what to choose — so they don't.",
            },
            {
              heading: "The wrong plan gets chosen",
              body: "Poor tier structure and anchoring nudges buyers to cheaper plans — or worse, away from your product entirely.",
            },
            {
              heading: "No way to improve",
              body: "Without A/B testing and conversion tracking, you're guessing. Most teams never know what's actually hurting them.",
            },
          ].map((item) => (
            <div key={item.heading} className="rounded-lg border p-4">
              <p className="font-semibold">{item.heading}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* Deliverables */}
      <div>
        <h2 className="text-2xl font-bold">Everything included</h2>
        <p className="mt-2 text-muted-foreground">
          Strategy through implementation — no coordinating between a strategist,
          copywriter, designer, and developer.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DELIVERABLES.map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* How it works */}
      <div>
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-8 space-y-6">
          {[
            {
              step: "1",
              title: "Apply",
              body: "Fill out a short form and share your current pricing page URL. We'll review it before we talk.",
            },
            {
              step: "2",
              title: "Strategy",
              body: "We develop the audit and strategy — tier structure, positioning, copy direction. You can review it on a call or async.",
            },
            {
              step: "3",
              title: "We build it",
              body: "Copy, design, and implementation delivered in approximately 2 weeks. We iterate until it's right.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                {item.step}
              </div>
              <div className="pt-0.5">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* Authority */}
      <div className="rounded-lg border bg-muted/40 p-6 text-center">
        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-semibold">Built on real data</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          PricingPages.com is a curated directory of hundreds of real SaaS pricing
          pages — analyzed for features, structure, copy patterns, and design. Every
          recommendation we make is informed by what actually works across the
          industry.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Browse the directory →
        </Link>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* Pricing */}
      <div className="rounded-lg border p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Pricing Page Revamp</h2>
            <p className="mt-1 text-muted-foreground">One-time, flat fee</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">$3,000</p>
          </div>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/revamp/apply"
          className="mt-8 block w-full rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Apply Now →
        </Link>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <dl className="mt-6 space-y-6">
          {FAQS.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold">{item.q}</dt>
              <dd className="mt-1.5 text-sm text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Divider */}
      <div className="my-16 border-t" />

      {/* Final CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Ready to turn your pricing page into your best sales asset?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Apply in 2 minutes. We&apos;ll review your page before we talk.
        </p>
        <Link
          href="/revamp/apply"
          className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Apply for a Revamp →
        </Link>
      </div>
    </div>
  )
}
