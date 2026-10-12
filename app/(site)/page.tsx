import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
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
    </>
  )
}
