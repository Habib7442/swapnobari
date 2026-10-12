import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Step colours from DESIGN.md §3.3. Numbers stay navy on a tint so contrast never depends on the hue.
const steps = [
  {
    title: "Share Requirement",
    text: "Tell us about your plot, budget and plans.",
    tint: "bg-[#E85D5D]/12 border-[#E85D5D]",
  },
  {
    title: "Consultation",
    text: "Talk to our team about design, Vastu and cost.",
    tint: "bg-[#3B82F6]/12 border-[#3B82F6]",
  },
  {
    title: "Budget & Plan",
    text: "Get a clear estimate and a Vastu-aligned floor plan.",
    tint: "bg-[#22A55B]/12 border-[#22A55B]",
  },
  {
    title: "Construction",
    text: "We build with quality materials and regular updates.",
    tint: "bg-[#F59E0B]/15 border-[#F59E0B]",
  },
  {
    title: "Handover",
    text: "Your finished home, ready for Griha Pravesh.",
    tint: "bg-[#8B5CF6]/12 border-[#8B5CF6]",
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="bg-gray-50 py-14 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 id="how-title" className="text-[26px] leading-tight font-bold text-navy-700 sm:text-[32px]">
            How It Works
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            A simple and transparent process from your first enquiry to handover.
          </p>
        </div>

        <ol className="relative mt-10 grid gap-8 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 lg:flex-col lg:gap-4">
              {/* Mobile: vertical connector. Desktop: arrow to the next step. */}
              {index < steps.length - 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute top-12 bottom-[-2rem] left-[21px] w-px bg-gray-200 lg:hidden"
                  />
                  <ChevronRight
                    aria-hidden="true"
                    className="absolute top-3 -right-5 hidden size-5 text-gray-500 lg:block"
                  />
                </>
              )}
              <span
                className={cn(
                  "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold text-navy-700",
                  step.tint
                )}
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-navy-700">{step.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
