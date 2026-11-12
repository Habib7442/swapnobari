import type { ReactElement } from "react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

/** Desktop only (AGENTS.md §6): on mobile the hero and the drawer carry WhatsApp. */
export function FloatingWhatsApp({ whatsappNumber }: { whatsappNumber: string }): ReactElement {
  return (
    <a
      href={whatsappUrl(whatsappNumber, whatsappMessage("general"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-brand-lg transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 md:inline-flex"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
