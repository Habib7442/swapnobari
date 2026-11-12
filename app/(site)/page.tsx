import type { Metadata } from "next"
import { CtaBand } from "@/components/home/cta-band"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { MaterialsSection } from "@/components/home/materials-section"
import { QuickFlow } from "@/components/home/quick-flow"
import { SanskarBand } from "@/components/home/sanskar-band"
import { ServicesSection } from "@/components/home/services-section"
import { JsonLd } from "@/components/seo/json-ld"
import { webPageJsonLd } from "@/lib/jsonld"
import { getRoute, pageMetadata } from "@/lib/seo"

const route = getRoute("/")

// The home title is already complete, so it skips the "| Swapnobari" template.
export const metadata: Metadata = pageMetadata("/", { absoluteTitle: true })

export default function HomePage() {
  return (
    <>
      <JsonLd data={[webPageJsonLd(route.path, route.title, route.description)]} />
      <Hero />
      <QuickFlow />
      <ServicesSection />
      <MaterialsSection />
      <HowItWorks />
      <SanskarBand />
      <CtaBand />
    </>
  )
}
