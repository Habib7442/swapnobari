import "server-only"
import { createHash } from "node:crypto"
import { headers } from "next/headers"

export type RequestInfo = {
  ip: string | null
  /** Salted SHA-256 of the IP. The raw IP is never stored. */
  ipHash: string | null
  device: "mobile" | "tablet" | "desktop" | null
}

export async function getRequestInfo(): Promise<RequestInfo> {
  const h = await headers()
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || null
  const salt = process.env.IP_HASH_SALT
  if (!salt) console.warn("[request] IP_HASH_SALT not set: using a fallback salt")
  const ipHash = ip
    ? createHash("sha256").update(`${salt ?? "swapnobari-fallback-salt"}:${ip}`).digest("hex")
    : null

  return { ip, ipHash, device: deviceFromUserAgent(h.get("user-agent") ?? "") }
}

function deviceFromUserAgent(ua: string): RequestInfo["device"] {
  if (!ua) return null
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet"
  if (/Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(ua)) return "mobile"
  return "desktop"
}
