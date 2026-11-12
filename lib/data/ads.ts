import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { AD_LABELS, PUBLIC_CACHE_TAGS, type AdLabel, type AdSlotKey } from "@/lib/constants"
import { createAdminClient } from "@/lib/supabase/admin"
import { createPublicClient } from "@/lib/supabase/public"
import type { AdEventInput } from "@/lib/validation/tracking"

const BUCKET_PATH = "/storage/v1/object/public/public-images"

export type LiveAd = {
  id: string
  desktopImageUrl: string
  mobileImageUrl: string
  linkUrl: string | null
  label: AdLabel
}

/** `active: false` = the slot is paused in admin, so it shows nothing at all. */
export type SlotAds = { active: boolean; ads: LiveAd[] }

function imageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}${BUCKET_PATH}/${path}`
}

function toLabel(value: string): AdLabel {
  return AD_LABELS.find((label) => label === value) ?? "advertisement"
}

/** Live banners sharing the slot's top priority (higher wins). RLS applies status and dates. */
export async function getSlotAds(slotKey: AdSlotKey): Promise<SlotAds> {
  "use cache"
  cacheTag(PUBLIC_CACHE_TAGS.ads)

  try {
    const supabase = createPublicClient()
    const slot = await supabase.from("ad_slots").select("id").eq("key", slotKey).maybeSingle()
    if (slot.error) throw slot.error
    if (!slot.data) {
      cacheLife("minutes")
      return { active: false, ads: [] }
    }

    const { data, error } = await supabase
      .from("ads")
      .select("id, desktop_image_path, mobile_image_path, link_url, label, priority")
      .eq("slot_id", slot.data.id)
      .order("priority", { ascending: false })
    if (error) throw error

    const top = data[0]?.priority
    cacheLife("minutes")
    return {
      active: true,
      ads: data
        .filter((ad) => ad.priority === top)
        .map((ad) => ({
          id: ad.id,
          desktopImageUrl: imageUrl(ad.desktop_image_path),
          mobileImageUrl: imageUrl(ad.mobile_image_path),
          linkUrl: ad.link_url,
          label: toLabel(ad.label),
        })),
    }
  } catch (error) {
    console.error("[ads] failed to load slot", slotKey, error)
    // Same reasoning as getEstimatorData: retry soon but stay prerenderable.
    cacheLife({ stale: 30, revalidate: 10, expire: 300 })
    return { active: true, ads: [] }
  }
}

/** Not cached: a banner that has just ended or been paused must stop counting. */
export async function isAdLive(adId: string): Promise<boolean> {
  const { data, error } = await createPublicClient().from("ads").select("id").eq("id", adId).maybeSingle()
  if (error) throw error
  return data !== null
}

export async function recordAdEvent(event: AdEventInput): Promise<void> {
  const { error } = await createAdminClient()
    .from("ad_events")
    .insert({ ad_id: event.adId, kind: event.kind, device: event.device })
  if (error) throw error
}
