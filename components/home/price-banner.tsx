import Link from "next/link"
import { ArrowRight, IndianRupee } from "lucide-react"
import { formatPriceDate } from "@/components/prices/price-list"

/** Link card to Today's Price. Shows only the last-updated date, never a price. */
export function PriceBanner({ latest }: { latest: string | null }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-navy-50 p-5 md:flex-row md:items-center md:gap-5 md:p-6">
      <div className="flex min-w-0 flex-1 items-start gap-4 md:items-center">
        <span aria-hidden="true" className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-navy-700">
          <IndianRupee className="size-6" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg leading-snug font-semibold text-navy-700">Today&apos;s Cement &amp; TMT Price</h3>
          <p className="mt-1 text-sm text-gray-600">Indicative prices. Actual price may vary by dealer and quantity.</p>
          {latest && <p className="mt-1 text-[13px] text-gray-500">Last updated {formatPriceDate(latest)}</p>}
        </div>
      </div>
      <Link
        href="/todays-price"
        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-white px-4 font-semibold whitespace-nowrap text-navy-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 md:w-auto md:bg-transparent"
      >
        Check prices
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  )
}
