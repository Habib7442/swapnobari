import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DealerResults } from "@/components/dealers/dealer-results"
import { JsonLd } from "@/components/seo/json-ld"
import { webPageJsonLd } from "@/lib/jsonld"
import { getRoute, pageMetadata } from "@/lib/seo"

const route = getRoute("/building-materials")

export const metadata: Metadata = pageMetadata("/building-materials")

export default function BuildingMaterialsPage({ searchParams }: PageProps<"/building-materials">) {
  return (
    <>
      <JsonLd data={[webPageJsonLd(route.path, route.title, route.description)]} />

      <section className="bg-cream-light pt-[116px] pb-10 md:pt-[132px]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
          <p className="text-xs font-semibold tracking-[0.14em] text-orange-600 uppercase">Building Materials</p>
          <h1 className="mt-2 text-[30px] leading-tight font-bold text-navy-700 sm:text-[40px]">
            Find Cement &amp; TMT Sellers Near You
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">Cement, TMT/Rod and more from trusted local sellers.</p>
          <Link
            href="/todays-price"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-medium text-navy-700 underline decoration-navy-700/40 underline-offset-4 hover:decoration-navy-700"
          >
            Check today&apos;s cement &amp; TMT price
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <section aria-label="Sellers" className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
          <Suspense fallback={<div aria-hidden="true" className="h-96 animate-pulse rounded-xl bg-gray-50" />}>
            <DealerResults searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
