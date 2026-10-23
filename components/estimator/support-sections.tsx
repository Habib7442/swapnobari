import { ChevronDown, Headset, ShieldCheck, Sparkles } from "lucide-react"
import { AdvisorForm } from "@/components/estimator/advisor-form"
import type { LocationOptions } from "@/components/estimator/location-fields"
import { ESTIMATOR_FAQ } from "@/lib/content/estimator-faq"
import type { Package, PackageFeature } from "@/lib/data/estimator"

/** Sections shared by the estimator page and the result page. */
export function EstimatorSupportSections({
  packages,
  features,
  locations,
}: {
  packages: Package[]
  features: PackageFeature[]
  locations: LocationOptions
}) {
  return (
    <>
      <PackageComparison packages={packages} features={features} />
      <CtaBand />
      <Faq />
      <AdvisorSection locations={locations} />
    </>
  )
}

function PackageComparison({ packages, features }: { packages: Package[]; features: PackageFeature[] }) {
  if (packages.length === 0 || features.length === 0) return null
  const labels = [...new Map(features.map((f) => [f.label, f.sort])).entries()].sort((a, b) => a[1] - b[1]).map(([l]) => l)
  const value = (slug: string, label: string) => features.find((f) => f.packageSlug === slug && f.label === label)?.value ?? "—"

  return (
    <section aria-labelledby="packages-title" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
        <h2 id="packages-title" className="text-[26px] font-bold text-navy-700 sm:text-[32px]">
          What&apos;s included in each package
        </h2>
        <p className="mt-2 text-base text-slate-600">Materials and finishes by package. Ask our team for the full specification.</p>

        {/* Desktop table */}
        <div className="mt-8 hidden overflow-hidden rounded-[18px] border border-hairline md:block">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-cream-light">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold text-navy-700">
                  Item
                </th>
                {packages.map((p) => (
                  <th key={p.slug} scope="col" className="px-5 py-4 font-semibold text-navy-700">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {labels.map((label) => (
                <tr key={label}>
                  <th scope="row" className="px-5 py-3.5 font-medium text-gray-800">
                    {label}
                  </th>
                  {packages.map((p) => (
                    <td key={p.slug} className="px-5 py-3.5 text-slate-600">
                      {value(p.slug, label)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one card per package */}
        <div className="mt-6 flex flex-col gap-4 md:hidden">
          {packages.map((p) => (
            <div key={p.slug} className="rounded-[18px] border border-hairline p-5">
              <h3 className="text-lg font-semibold text-navy-700">{p.name}</h3>
              <dl className="mt-3 divide-y divide-hairline text-sm">
                {labels.map((label) => (
                  <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-right font-medium text-gray-800">{value(p.slug, label)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBand() {
  return (
    <section className="bg-cream-light py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-5 px-5 md:flex-row md:items-center md:px-8 xl:px-12">
        <div>
          <p className="text-xl font-semibold text-navy-700 sm:text-2xl">Planning to build? Talk to us before you start.</p>
          <p className="mt-1 text-[15px] text-slate-600">Get the right plan, budget and Vastu guidance from day one.</p>
        </div>
        <a
          href="#advisor"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-[10px] bg-orange-500 px-6 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Talk to an advisor
        </a>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[920px] px-5 md:px-8">
        <h2 id="faq-title" className="text-[26px] font-bold text-navy-700 sm:text-[32px]">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-hairline border-y border-hairline">
          {ESTIMATOR_FAQ.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16px] font-medium text-navy-700 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-[15px] leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

const advisorPoints = [
  { icon: Headset, text: "An advisor calls you to understand your plot and plans" },
  { icon: Sparkles, text: "We walk you through packages, Vastu and timelines" },
  { icon: ShieldCheck, text: "You get a clear, itemised quote with no obligation" },
]

function AdvisorSection({ locations }: { locations: LocationOptions }) {
  return (
    <section id="advisor" aria-labelledby="advisor-title" className="scroll-mt-20 bg-navy-50 py-14 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center xl:px-12">
        <div>
          <h2 id="advisor-title" className="text-[26px] font-bold text-navy-700 sm:text-[32px]">
            Talk to an advisor
          </h2>
          <p className="mt-2 max-w-[520px] text-base text-slate-600">
            Want an exact figure for your house? Share your details and our team will get in touch.
          </p>
          <ul className="mt-6 flex flex-col gap-3.5">
            {advisorPoints.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] text-gray-800">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-brand-sm">
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <AdvisorForm locations={locations} />
      </div>
    </section>
  )
}
