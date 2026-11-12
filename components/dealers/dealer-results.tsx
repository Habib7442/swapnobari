import type { ReactElement } from "react"
import { AdBanner } from "@/components/ads/ad-banner"
import { DealerCard } from "@/components/dealers/dealer-card"
import { DealerSearchForm } from "@/components/dealers/dealer-search-form"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { GENERIC_ERROR } from "@/lib/constants"
import { getPublicDealers, getSearchOptions } from "@/lib/data/dealers"
import { filterDealers } from "@/lib/domain/dealers"
import { getWhatsAppNumber } from "@/lib/env"
import { siteConfig } from "@/lib/site-config"
import { parseDealerSearch } from "@/lib/validation/dealer-search"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

type DealerResultsProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

/** Reads the URL, so it renders inside <Suspense>; the dealer list itself is cached. */
export async function DealerResults({ searchParams }: DealerResultsProps): Promise<ReactElement> {
  const parsed = parseDealerSearch(await searchParams)
  const [{ dealers, failed }, options] = await Promise.all([getPublicDealers(), getSearchOptions()])
  // A brand of another material is dropped, as the form does when the material changes.
  const brandFits =
    !parsed.brand ||
    !parsed.material ||
    options.brands.some((option) => option.slug === parsed.brand && option.materialSlug === parsed.material)
  const filter = brandFits ? parsed : { ...parsed, brand: undefined }
  const results = filterDealers(dealers, filter)
  const whatsappNumber = getWhatsAppNumber()
  const askHref = whatsappUrl(whatsappNumber, whatsappMessage("materials", { area: siteConfig.address.locality }))

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <DealerSearchForm options={options} initial={filter} />

        {results.length > 0 ? (
          <>
            <p aria-live="polite" className="mt-6 text-sm text-gray-600">
              {results.length} {results.length === 1 ? "seller" : "sellers"} found
            </p>
            <ul className="mt-3 grid gap-4 md:grid-cols-2">
              {results.map((dealer) => (
                <li key={dealer.id}>
                  <DealerCard dealer={dealer} whatsappNumber={whatsappNumber} materialSlug={filter.material} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div aria-live="polite" className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-gray-50 px-5 py-12 text-center">
            <p className="max-w-md text-base text-gray-600">
              {failed ? GENERIC_ERROR : "No sellers listed here yet. Tell us what you need and we'll arrange a quote."}
            </p>
            <a
              href={askHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-green-500 px-6 font-semibold text-white transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <WhatsAppIcon className="size-5" />
              WhatsApp Us
            </a>
          </div>
        )}
      </div>

      <aside aria-label="Advertisement" className="mx-auto w-full max-w-md lg:max-w-none">
        <div className="lg:sticky lg:top-24">
          <AdBanner slotKey="materials_side" />
        </div>
      </aside>
    </div>
  )
}
