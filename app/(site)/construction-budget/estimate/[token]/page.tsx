import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { EstimateResult } from "@/components/estimator/estimate-result"
import { EstimatorSupportSections } from "@/components/estimator/support-sections"
import { getWhatsAppNumber } from "@/lib/env"
import { getEstimatorData } from "@/lib/data/estimator"
import { getEstimateByToken } from "@/lib/data/leads"

export const metadata: Metadata = {
  title: "Your construction estimate",
  robots: { index: false, follow: false },
}

export default async function EstimatePage({ params }: PageProps<"/construction-budget/estimate/[token]">) {
  const data = await getEstimatorData()

  return (
    <>
      <section className="bg-cream-light">
        <div className="mx-auto max-w-[1440px] px-5 pt-[96px] pb-14 md:px-8 md:pt-[116px] md:pb-20 xl:px-12">
          <Link
            href="/construction-budget"
            className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy-700 hover:text-orange-600"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            New estimate
          </Link>
          <Suspense fallback={<ResultSkeleton />}>
            <Result params={params} disclaimer={data.disclaimer} />
          </Suspense>
        </div>
      </section>
      <EstimatorSupportSections
        packages={data.packages}
        features={data.features}
        locations={{ cities: data.cities, areas: data.areas }}
      />
    </>
  )
}

async function Result({
  params,
  disclaimer,
}: {
  params: PageProps<"/construction-budget/estimate/[token]">["params"]
  disclaimer: string
}) {
  const { token } = await params
  const result = await getEstimateByToken(token)
  if (!result) notFound()

  return (
    <EstimateResult
      refCode={result.refCode}
      firstName={result.firstName}
      details={result.details}
      whatsappNumber={getWhatsAppNumber()}
      disclaimer={disclaimer}
    />
  )
}

function ResultSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your estimate" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="h-[420px] animate-pulse rounded-[22px] bg-navy-900/90" />
      <div className="h-[420px] animate-pulse rounded-[22px] bg-white" />
    </div>
  )
}
