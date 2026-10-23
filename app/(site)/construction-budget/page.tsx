import type { Metadata } from "next"
import { Calculator, Layers, MapPin } from "lucide-react"
import { EstimatorCard } from "@/components/estimator/estimator-card"
import { EstimatorSupportSections } from "@/components/estimator/support-sections"
import { JsonLd } from "@/components/seo/json-ld"
import { ESTIMATOR_FAQ } from "@/lib/content/estimator-faq"
import { getEstimatorData, type EstimatorData } from "@/lib/data/estimator"
import { formatRupees } from "@/lib/domain/estimate"
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/jsonld"
import { getRoute, pageMetadata } from "@/lib/seo"

const route = getRoute("/construction-budget")

export const metadata: Metadata = pageMetadata(route.path)

const steps = [
  { icon: MapPin, title: "Your location", text: "Rates are set per city, based on local labour and material costs." },
  { icon: Layers, title: "Size and floors", text: "Built-up area of one floor × number of floors." },
  {
    icon: Calculator,
    title: "A range, not one number",
    text: "Design, soil and materials change the final cost, so we show a realistic range.",
  },
]

export default async function ConstructionBudgetPage() {
  const data = await getEstimatorData()
  const locations = { cities: data.cities, areas: data.areas }

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(route.path, route.title, route.description),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Construction Budget", path: route.path },
          ]),
          faqJsonLd(ESTIMATOR_FAQ),
        ]}
      />

      <section aria-labelledby="budget-page-title" className="bg-cream-light">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pt-[100px] pb-14 md:px-8 md:pt-[124px] md:pb-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-16 xl:px-12">
          <div className="max-w-[600px] animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-700/[0.08] bg-white px-3.5 py-2 text-[13px] font-medium text-navy-700">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-orange-500" />
              Free cost calculator{data.cities[0] ? ` · ${data.cities[0].name}` : ""}
            </p>
            <h1
              id="budget-page-title"
              className="mt-4 font-display text-[clamp(32px,8.5vw,38px)] leading-[1.06] font-medium tracking-[-0.02em] text-navy-700 md:mt-5 md:text-[clamp(40px,4vw,58px)]"
            >
              House construction <em className="italic">cost calculator</em>
            </h1>
            <p className="mt-4 max-w-[520px] text-[17px] leading-[1.6] text-gray-800 md:text-lg">
              Enter your built-up area and number of floors to see an instant cost range for Basic, Standard and
              Premium packages, with a stage-wise and floor-wise breakdown.
            </p>

            <RatesStrip data={data} />
            <HowWeCalculate className="mt-10 hidden lg:block" />
          </div>

          <EstimatorCard
            locations={locations}
            sourceButton="estimator_page"
            title="Calculate your estimate"
            className="w-full animate-fade-up [animation-delay:120ms] md:max-w-[560px] lg:sticky lg:top-24 lg:w-[400px] lg:max-w-none"
          />

          <HowWeCalculate className="lg:hidden" />
        </div>
      </section>

      <EstimatorSupportSections packages={data.packages} features={data.features} locations={locations} />
    </>
  )
}

/** Indicative rates for the first active city. Hidden until real rates exist (never placeholders). */
function RatesStrip({ data }: { data: EstimatorData }) {
  const city = data.cities[0]
  const rates = city ? (data.ratesByCity[city.id] ?? []) : []
  if (!city || rates.length === 0) return null
  return (
    <div className="mt-7">
      <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">INDICATIVE RATES PER SQ FT · {city.name.toUpperCase()}</p>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {rates.map((rate) => (
          <li key={rate.slug} className="rounded-[12px] border border-navy-700/[0.08] bg-white px-4 py-2.5">
            <span className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">{rate.name}</span>
            <span className="block text-lg font-semibold text-navy-700">{formatRupees(rate.ratePerSqft)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HowWeCalculate({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-navy-700">How are these rates estimated?</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {steps.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-navy-700 shadow-brand-sm">
              <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-navy-700">{title}</p>
              <p className="mt-0.5 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 rounded-xl border border-hairline bg-white px-4 py-3 text-[13px] leading-relaxed text-slate-600">
        Approximate estimate. Final cost depends on design, site and materials.
      </p>
    </div>
  )
}
