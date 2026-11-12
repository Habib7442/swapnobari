import type { ReactElement } from "react"
import type { Metadata } from "next"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { PriceList, formatPriceDate } from "@/components/prices/price-list"
import { JsonLd } from "@/components/seo/json-ld"
import { GENERIC_ERROR } from "@/lib/constants"
import { getPublicPrices } from "@/lib/data/prices"
import { getWhatsAppNumber } from "@/lib/env"
import { webPageJsonLd } from "@/lib/jsonld"
import { getRoute, pageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site-config"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

const route = getRoute("/todays-price")

export const metadata: Metadata = pageMetadata("/todays-price")

export default async function TodaysPricePage(): Promise<ReactElement> {
  const { rows, failed } = await getPublicPrices()
  const latest = rows.reduce<string | null>(
    (newest, row) => (!newest || row.updatedAt > newest ? row.updatedAt : newest),
    null
  )
  const whatsappHref = whatsappUrl(
    getWhatsAppNumber(),
    whatsappMessage("materials", { area: siteConfig.address.locality })
  )

  return (
    <>
      <JsonLd data={[webPageJsonLd(route.path, route.title, route.description)]} />

      <section className="bg-cream-light pt-[116px] pb-10 md:pt-[132px]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
          <h1 className="text-[30px] leading-tight font-bold text-navy-700 sm:text-[40px]">
            Today&apos;s Cement &amp; TMT Price
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Indicative prices. Actual price may vary by dealer and quantity.
          </p>
          {latest && <p className="mt-2 text-sm font-medium text-navy-700">Last updated {formatPriceDate(latest)}</p>}
        </div>
      </section>

      <section aria-label="Prices" className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12">
          {rows.length > 0 ? (
            <PriceList rows={rows} />
          ) : (
            <p className="rounded-xl bg-gray-50 px-5 py-10 text-center text-base text-gray-600">
              {failed ? GENERIC_ERROR : "Prices are being updated. WhatsApp us for today's rate."}
            </p>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-green-500 px-6 py-2 text-center font-semibold text-white transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:w-auto"
          >
            <WhatsAppIcon className="size-5 shrink-0" />
            Get exact price from sellers near me
          </a>
        </div>
      </section>
    </>
  )
}
