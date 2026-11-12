"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import type { AdEventKind, AdSlotKey } from "@/lib/constants"
import type { LiveAd } from "@/lib/data/ads"
import { useAdStore } from "@/lib/stores/ad-store"

const LABEL_TEXT = { advertisement: "Advertisement", sponsored: "Sponsored" } as const

function currentDevice(): "mobile" | "tablet" | "desktop" {
  if (window.innerWidth < 768) return "mobile"
  return window.innerWidth < 1024 ? "tablet" : "desktop"
}

function sendAdEvent(adId: string, kind: AdEventKind): void {
  const body = JSON.stringify({ adId, kind, device: currentDevice() })
  navigator.sendBeacon("/api/track/ad", new Blob([body], { type: "application/json" }))
}

type AdBannerClientProps = { slotKey: AdSlotKey; ads: LiveAd[] }

export function AdBannerClient({ slotKey, ads }: AdBannerClientProps) {
  const pickedId = useAdStore((state) => state.picks[slotKey])
  const choose = useAdStore((state) => state.choose)
  const markSeen = useAdStore((state) => state.markSeen)
  const frame = useRef<HTMLDivElement>(null)

  const ad = ads.find((candidate) => candidate.id === pickedId) ?? ads[0]
  const adId = ad?.id

  useEffect(() => {
    choose(
      slotKey,
      ads.map((candidate) => candidate.id)
    )
  }, [choose, slotKey, ads])

  // Counts only the banner actually picked, once at least half of it has been on screen.
  useEffect(() => {
    const node = frame.current
    if (!node || !adId || pickedId !== adId) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        if (markSeen(adId)) sendAdEvent(adId, "impression")
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [adId, pickedId, markSeen])

  if (!ad) return null
  const label = LABEL_TEXT[ad.label]

  const images = (
    <>
      {/* The 1px `sizes` keeps each device from downloading the other image (same as the hero). */}
      <Image
        src={ad.mobileImageUrl}
        alt={label}
        fill
        sizes="(min-width: 768px) 1px, 100vw"
        className="object-cover md:hidden"
      />
      <Image
        src={ad.desktopImageUrl}
        alt={label}
        fill
        sizes="(max-width: 767px) 1px, (max-width: 1023px) 720px, 480px"
        className="hidden object-cover md:block"
      />
    </>
  )

  return (
    <div
      ref={frame}
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-50"
    >
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="sponsored noopener"
          aria-label={`${label}, opens in a new tab`}
          onClick={() => sendAdEvent(ad.id, "click")}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500"
        >
          {images}
        </a>
      ) : (
        images
      )}
      <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white uppercase">
        {label}
      </span>
    </div>
  )
}
