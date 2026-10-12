import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HardHat, House } from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { getWhatsAppNumber } from "@/lib/env"

export const metadata: Metadata = {
  title: "Coming soon",
}

/**
 * Root 404: catches every unmatched URL, including site pages that are not built yet.
 * Renders inside the root layout only, so it adds the site header itself.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream-light">
      <SiteHeader whatsappNumber={getWhatsAppNumber()} />
      <main className="relative isolate flex flex-1 items-center overflow-hidden">
        {/* Soft blueprint grid, fading out towards the edges. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(19,41,75,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(19,41,75,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-[size:40px_40px]"
        />

        <div className="mx-auto w-full max-w-[1440px] px-5 pt-[120px] pb-16 md:px-8 xl:px-12">
          <div className="mx-auto flex max-w-[560px] animate-fade-up flex-col items-center text-center">
            <span className="inline-flex size-16 items-center justify-center rounded-[18px] bg-orange-50 text-orange-600 shadow-brand-sm">
              <HardHat aria-hidden="true" className="size-8" strokeWidth={1.75} />
            </span>

            <p className="mt-6 text-[11px] font-semibold tracking-[0.14em] text-orange-600">COMING SOON</p>
            <h1 className="mt-2 font-display text-[clamp(32px,8vw,48px)] leading-[1.08] font-medium tracking-[-0.02em] text-navy-700">
              This page is <em className="italic">under construction</em>
            </h1>
            <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-slate-600">
              We&apos;re still building this part of Swapnobari. Meanwhile, find out what your house
              will cost or head back home.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/construction-budget"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-orange-500 px-6 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(242,107,29,0.25)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
              >
                Get Free Estimate
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-navy-700/15 bg-white px-6 text-[15px] font-semibold text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <House aria-hidden="true" className="size-4" />
                Back to Home
              </Link>
            </div>

            <p className="mt-8 text-[13px] text-slate-500">
              Typed the address yourself? Check it for typos.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
