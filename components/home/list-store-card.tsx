import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"
import { getWhatsAppNumber } from "@/lib/env"
import { getRoute } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

const BUTTON =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] border border-navy-700 bg-white px-5 text-sm font-semibold whitespace-nowrap text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"

/** Fills the rest of the Featured Sellers row with an invitation to dealers. Never a fake seller. */
export function ListStoreCard({ className }: { className?: string }) {
  const pageLive = getRoute("/list-your-store").live
  const label = (
    <>
      List Your Store
      <ArrowRight aria-hidden="true" className="size-4" />
    </>
  )

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center",
        className
      )}
    >
      <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
        <Store className="size-6" strokeWidth={1.75} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-navy-700">Sell cement or TMT in Silchar?</h3>
        <p className="mt-1 text-sm text-gray-500">Get a free listing and enquiries on WhatsApp.</p>
      </div>
      {pageLive ? (
        <Link href="/list-your-store" className={BUTTON}>
          {label}
        </Link>
      ) : (
        <a
          href={whatsappUrl(getWhatsAppNumber(), whatsappMessage("listStore"))}
          target="_blank"
          rel="noopener noreferrer"
          className={BUTTON}
        >
          {label}
        </a>
      )}
    </div>
  )
}
