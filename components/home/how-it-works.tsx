import { ChevronRight } from "lucide-react"
import { RevealList } from "@/components/site/reveal-list"
import { Section } from "@/components/site/section"
import { SectionHeader } from "@/components/site/section-header"
import { cn } from "@/lib/utils"

// Step colours from DESIGN.md §3.3 (tokens in app/globals.css). The number keeps colour from being the only signal.
const steps = [
  {
    title: "Share Requirement",
    text: "Tell us about your plot, budget and plans.",
    circle: "bg-step-coral ring-step-coral/15",
  },
  {
    title: "Consultation",
    text: "Talk to our team about design, Vastu and cost.",
    circle: "bg-step-blue ring-step-blue/15",
  },
  {
    title: "Budget & Plan",
    text: "Get a clear estimate and a Vastu-aligned floor plan.",
    circle: "bg-step-green ring-step-green/15",
  },
  {
    title: "Construction",
    text: "We build with quality materials and regular updates.",
    circle: "bg-step-amber ring-step-amber/15",
  },
  {
    title: "Handover",
    text: "Your finished home, ready for Griha Pravesh.",
    circle: "bg-step-violet ring-step-violet/15",
  },
]

export function HowItWorks() {
  return (
    <Section labelledBy="how-title" background="gray-50">
      <SectionHeader
        id="how-title"
        eyebrow="The Process"
        title="How It Works"
        subtitle="A simple and transparent process from your first enquiry to handover."
      />

      {/* Mobile: vertical timeline. md: 3 + 2 grid. lg: five columns with connectors. */}
      <RevealList className="group mt-10 grid gap-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-5 lg:gap-6">
        {steps.map((step, index) => (
          <li
            key={step.title}
            style={{ animationDelay: `${index * 60}ms` }}
            className="relative flex gap-4 group-data-[reveal=in]:animate-fade-up group-data-[reveal=pending]:opacity-0 md:flex-col"
          >
            {index < steps.length - 1 && (
              <>
                {/* Mobile: from the bottom of this circle to the top of the next, across the 32px gap. */}
                <span aria-hidden="true" className="absolute top-11 bottom-[-32px] left-[21px] w-0.5 bg-gray-500/30 md:hidden" />
                {/* lg: from right of this ring to just before the next circle's ring, across the 24px gap. */}
                <span aria-hidden="true" className="absolute top-[14px] -right-4 left-14 hidden items-center lg:flex">
                  <span className="flex-1 border-t border-dashed border-gray-500/40" />
                  <ChevronRight className="-ml-1 size-4 shrink-0 text-gray-500" />
                </span>
              </>
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ring-4",
                step.circle
              )}
            >
              {index + 1}
            </span>
            <div className="min-w-0 pt-2.5 md:pt-0">
              <h3 className="text-base leading-snug font-semibold text-navy-700">{step.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-gray-600">{step.text}</p>
            </div>
          </li>
        ))}
      </RevealList>
    </Section>
  )
}
