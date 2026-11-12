import type { ReactElement } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AdBanner } from "@/components/ads/ad-banner"
import { DealerCard } from "@/components/dealers/dealer-card"
import { DealerSearchForm } from "@/components/dealers/dealer-search-form"
import { ListStoreCard } from "@/components/home/list-store-card"
import { MaterialCard } from "@/components/home/material-card"
import { PriceBanner } from "@/components/home/price-banner"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Section } from "@/components/site/section"
import { SectionHeader } from "@/components/site/section-header"
import { GENERIC_ERROR } from "@/lib/constants"
import { getPublicDealers, getSearchOptions } from "@/lib/data/dealers"
import { getEnabledMaterials } from "@/lib/data/materials"
import { getPublicPrices } from "@/lib/data/prices"
import { countDealersByMaterial } from "@/lib/domain/dealers"
import { getWhatsAppNumber } from "@/lib/env"
import { siteConfig } from "@/lib/site-config"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

/** One row at lg (4 columns). The "List your store" card fills a slot only when there are fewer. */
const FEATURED_COUNT = 4

export async function MaterialsSection(): Promise<ReactElement> {
  const [materials, { dealers, failed }, options, prices] = await Promise.all([
    getEnabledMaterials(),
    getPublicDealers(),
    getSearchOptions(),
    getPublicPrices(),
  ])
  const whatsappNumber = getWhatsAppNumber()
  const featured = dealers.slice(0, FEATURED_COUNT)
  const sellerCounts = countDealersByMaterial(dealers)
  const latestPrice = prices.rows.reduce<string | null>(
    (newest, row) => (!newest || row.updatedAt > newest ? row.updatedAt : newest),
    null
  )

  return (
    <Section id="materials" labelledBy="materials-title" background="white">
      <SectionHeader
        id="materials-title"
        eyebrow="Building Materials"
        title="Find Building Materials Near You"
        subtitle="Cement, TMT/Rod and more from trusted local sellers."
      />

      {/* DOM order is the mobile order: tiles + search, sellers, ad, price banner.
          lg: tiles + search (2/3) beside the ad (1/3, centred), then sellers and the price banner at full width. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-y-10">
        <div className="min-w-0 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          {materials.length > 0 && (
            <ul className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 py-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:p-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden">
              {materials.map((material) => (
                <li key={material.id} className="w-[220px] shrink-0 snap-start md:w-auto">
                  <MaterialCard material={material} sellerCount={sellerCounts.get(material.id) ?? 0} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <DealerSearchForm options={options} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-3 lg:row-start-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-navy-700">Featured Sellers</h3>
            <Link
              href="/building-materials"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-navy-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              View All Sellers
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <ul className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featured.length === 0 && (
              <li className="md:col-span-2 lg:col-span-3">
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 px-5 py-10 text-center">
                  <p className="max-w-md text-base text-gray-600">
                    {failed
                      ? GENERIC_ERROR
                      : "No sellers listed here yet. Tell us what you need and we'll arrange a quote."}
                  </p>
                  <a
                    href={whatsappUrl(whatsappNumber, whatsappMessage("materials", { area: siteConfig.address.locality }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-green-500 px-6 font-semibold text-white transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    <WhatsAppIcon className="size-5" />
                    WhatsApp Us
                  </a>
                </div>
              </li>
            )}
            {featured.map((dealer) => (
              <li key={dealer.id}>
                <DealerCard dealer={dealer} whatsappNumber={whatsappNumber} />
              </li>
            ))}
            {featured.length < FEATURED_COUNT && (
              <li>
                <ListStoreCard />
              </li>
            )}
          </ul>
        </div>

        <aside
          aria-label="Advertisement"
          className="mx-auto mt-2 w-full max-w-[720px] md:mt-0 lg:col-start-3 lg:row-start-1 lg:max-w-none lg:self-center"
        >
          <AdBanner slotKey="home_materials_side" fallbackSlotKey="home_banner" />
        </aside>

        <div className="min-w-0 lg:col-span-3 lg:row-start-3">
          <PriceBanner latest={latestPrice} />
        </div>
      </div>
    </Section>
  )
}
