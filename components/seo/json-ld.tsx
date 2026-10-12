import { serializeJsonLd, type JsonLdThing } from "@/lib/jsonld"

/** Renders one <script type="application/ld+json"> per item. `null` items are skipped. */
export function JsonLd({ data }: { data: (JsonLdThing | null)[] }) {
  return (
    <>
      {data
        .filter((item): item is JsonLdThing => item !== null)
        .map((item, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
          />
        ))}
    </>
  )
}
