"use client"

type DealerGetPriceProps = { href: string; dealerId: string; categoryId?: string }

/** Opens WhatsApp to Swapnobari and logs the click against the dealer. */
export function DealerGetPrice({ href, dealerId, categoryId }: DealerGetPriceProps) {
  function logClick(): void {
    const body = JSON.stringify({ dealerId, categoryId })
    navigator.sendBeacon("/api/track/dealer", new Blob([body], { type: "application/json" }))
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={logClick}
      className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
    >
      Get Price
    </a>
  )
}
