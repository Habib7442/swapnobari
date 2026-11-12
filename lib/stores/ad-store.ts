import { create } from "zustand"
import type { AdSlotKey } from "@/lib/constants"

type AdStore = {
  /** Banner shown in each slot since this page load. */
  picks: Partial<Record<AdSlotKey, string>>
  /** Banners whose impression has already been sent. */
  seen: Record<string, true>
  /** Picks at random among `adIds`; keeps an earlier pick that is still live. */
  choose: (slot: AdSlotKey, adIds: string[]) => void
  /** Records an impression. False if this banner was already counted. */
  markSeen: (adId: string) => boolean
  /** Undoes `markSeen` when the impression could not be sent, so it can be retried. */
  unmarkSeen: (adId: string) => void
}

/**
 * Browser-only: written from effects, never during render, so the module-level store is not
 * changed on the server and can't leak between requests. A remount neither swaps the banner nor
 * counts it twice. A full page load starts fresh.
 */
export const useAdStore = create<AdStore>()((set, get) => ({
  picks: {},
  seen: {},
  choose: (slot, adIds) => {
    const current = get().picks[slot]
    if (current && adIds.includes(current)) return
    const pick = adIds[Math.floor(Math.random() * adIds.length)]
    if (pick) set((state) => ({ picks: { ...state.picks, [slot]: pick } }))
  },
  markSeen: (adId) => {
    if (get().seen[adId]) return false
    set((state) => ({ seen: { ...state.seen, [adId]: true } }))
    return true
  },
  unmarkSeen: (adId) => {
    set((state) => ({
      seen: Object.fromEntries(Object.entries(state.seen).filter(([id]) => id !== adId)),
    }))
  },
}))
