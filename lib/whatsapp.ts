/**
 * WhatsApp click-to-chat links and the pre-filled message templates used across the site.
 * Pure functions only, so both Server and Client Components can import this file.
 * The number itself comes from the server (see lib/env.ts) and is passed down as a prop.
 */

export type WhatsAppTemplateKey =
  | "general"
  | "enquiry"
  | "estimate"
  | "estimateRequested"
  | "consultation"
  | "vastu"
  | "materials"
  | "dealerPrice"

type TemplateVars = Record<string, string | number | undefined>

/** Pre-filled messages. `{placeholders}` are replaced by `whatsappMessage()`; empty lines are dropped. */
export const WHATSAPP_TEMPLATES: Record<WhatsAppTemplateKey, string> = {
  // Floating / drawer / generic WhatsApp buttons.
  general: "Hi Swapnobari, I'd like to know more about building my house.",

  // Header "Enquire Now".
  enquiry:
    "Hi Swapnobari! I'm planning to build a house and would like to talk to your team. Please share the next steps.",

  // Hero and estimate CTAs.
  estimate: "Hi Swapnobari, I'd like a free construction cost estimate for my house.",

  // After the budget form is submitted (PRD §6.4: chat on WhatsApp with the lead details).
  estimateRequested: [
    "Hi Swapnobari, I just requested a construction budget estimate.",
    "Name: {name}",
    "Location: {location}",
    "Size: {size} sq ft",
    "Floors: {floors}",
    "Reference: {leadId}",
  ].join("\n"),

  // Service enquiries (Build Your Home page, later).
  consultation: "Hi Swapnobari, I'd like to book a pre-construction consultation for my house.",
  vastu: "Hi Swapnobari, I'd like Vastu-aligned planning for my house.",

  // Building materials.
  materials: "Hi Swapnobari, I need cement / TMT prices from sellers near {area}.",

  // Dealer cards (PRD §7.2). Sent to the dealer's number, not Swapnobari's.
  dealerPrice: "Hi, I found you on Swapnobari. I need a price for {material} in {area}.",
}

/** Fills a template. Lines whose placeholders are all empty are removed, so optional fields vanish cleanly. */
export function whatsappMessage(key: WhatsAppTemplateKey, vars: TemplateVars = {}): string {
  return WHATSAPP_TEMPLATES[key]
    .split("\n")
    .map((line) => {
      const placeholders = line.match(/\{(\w+)\}/g) ?? []
      const filled = placeholders.filter((p) => {
        const value = vars[p.slice(1, -1)]
        return value !== undefined && String(value).trim() !== ""
      })
      if (placeholders.length > 0 && filled.length === 0) return null
      return line.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? "").trim())
    })
    .filter((line): line is string => line !== null)
    .join("\n")
}

/** Digits only, with India's 91 prefix added to 10-digit numbers. Returns null if the number is unusable. */
export function normalizeWhatsAppNumber(raw: string | undefined): string | null {
  if (!raw) return null
  let digits = raw.replace(/\D/g, "")
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  if (digits.length === 10) digits = `91${digits}`
  return /^91[6-9]\d{9}$/.test(digits) ? digits : null
}

/** https://wa.me/<number>?text=<encoded message> */
export function whatsappUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
