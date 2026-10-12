import type { Metadata } from "next"
import { Calculator, Layers, MapPin } from "lucide-react"
import { BudgetCard } from "@/components/home/budget-card"
import { JsonLd } from "@/components/seo/json-ld"
import { getWhatsAppNumber } from "@/lib/env"
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/jsonld"
import { getRoute, pageMetadata } from "@/lib/seo"

const route = getRoute("/construction-budget")

export const metadata: Metadata = pageMetadata(route.path)

const steps = [
  {
    icon: MapPin,
    title: "Your location",
    text: "We use current construction rates for your city and area.",
  },
  {
    icon: Layers,
    title: "Size and floors",
    text: "Your built-up area and number of floors set the scale of the build.",
  },
  {
    icon: Calculator,
    title: "A range, not one number",
    text: "Design, site and materials change the final cost, so we give you a realistic range.",
  },
]

export default function ConstructionBudgetPage() {
  return (
    <section aria-labelledby="budget-page-title" className="bg-cream-light">
      <JsonLd
        data={[
          webPageJsonLd(route.path, route.title, route.description),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Construction Budget", path: route.path },
          ]),
        ]}
      />
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pt-[100px] pb-12 md:px-8 md:pt-[124px] md:pb-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-16 xl:px-12">
        <div className="max-w-[560px] animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-navy-700/[0.08] bg-white px-3.5 py-2 text-[13px] font-medium text-navy-700">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-orange-500" />
            Free estimate · Silchar, Assam
          </p>
          <h1
            id="budget-page-title"
            className="mt-4 font-display text-[clamp(32px,8.5vw,36px)] leading-[1.08] font-medium tracking-[-0.02em] text-navy-700 md:mt-5 md:text-[clamp(40px,4vw,56px)]"
          >
            What will your <em className="italic">house</em> cost to build?
          </h1>
          <p className="mt-4 max-w-[480px] text-[17px] leading-[1.6] text-gray-800 md:text-lg">
            Share a few details and get an approximate construction cost in minutes.
          </p>

          {/* Desktop: how the estimate works sits beside the form. On phones it follows the form. */}
          <HowWeCalculate className="mt-10 hidden lg:block" />
        </div>

        <BudgetCard whatsappNumber={getWhatsAppNumber()} className="w-full animate-fade-up [animation-delay:120ms] md:max-w-[560px] lg:sticky lg:top-24 lg:w-[380px] lg:max-w-none" />

        <HowWeCalculate className="lg:hidden" />
      </div>
    </section>
  )
}

function HowWeCalculate({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-navy-700">How we calculate</h2>
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
