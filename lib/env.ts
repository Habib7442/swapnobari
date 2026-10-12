import "server-only"
import { normalizeWhatsAppNumber } from "@/lib/whatsapp"

/**
 * Swapnobari's WhatsApp number from `WHATSAPP_NUMBER` (server-only env), normalised to 91XXXXXXXXXX.
 * Read on the server and passed to Client Components as a prop, so it never needs NEXT_PUBLIC_.
 * Moves to `site_settings` once the admin panel exists (AGENTS.md §11).
 */
export function getWhatsAppNumber(): string {
  const number = normalizeWhatsAppNumber(process.env.WHATSAPP_NUMBER)
  if (!number) {
    throw new Error(
      "WHATSAPP_NUMBER is missing or invalid. Set a 10-digit Indian mobile number in .env.local (e.g. WHATSAPP_NUMBER=98XXXXXXXX)."
    )
  }
  return number
}
