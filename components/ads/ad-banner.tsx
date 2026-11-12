import type { ReactElement } from "react"
import type { AdSlotKey } from "@/lib/constants"
import { AdBannerClient } from "@/components/ads/ad-banner-client"
import { getSlotAds, type SlotAds } from "@/lib/data/ads"
import { getWhatsAppNumber } from "@/lib/env"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

type AdBannerProps = {
  slotKey: AdSlotKey
  /** Shown when this slot is on but has no live banner. */
  fallbackSlotKey?: AdSlotKey
}

async function loadAds(slotKey: AdSlotKey, fallbackSlotKey?: AdSlotKey): Promise<SlotAds> {
  const slot = await getSlotAds(slotKey)
  if (!slot.active || slot.ads.length > 0 || !fallbackSlotKey) return slot
  const fallback = await getSlotAds(fallbackSlotKey)
  return fallback.ads.length > 0 ? fallback : slot
}

/** An admin-managed banner. Paused slot: nothing. No live banner: the grey "Advertise here" box. */
export async function AdBanner({ slotKey, fallbackSlotKey }: AdBannerProps): Promise<ReactElement | null> {
  const { active, ads } = await loadAds(slotKey, fallbackSlotKey)
  if (!active) return null

  if (ads.length === 0) {
    return (
      <a
        href={whatsappUrl(getWhatsAppNumber(), whatsappMessage("advertise"))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gray-50 text-sm font-medium text-gray-500 transition-colors hover:text-navy-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        Advertise here: contact us
      </a>
    )
  }

  return <AdBannerClient slotKey={slotKey} ads={ads} />
}
