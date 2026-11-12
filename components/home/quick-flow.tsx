import Link from "next/link"
import { QUICK_FLOW, actionLinkProps } from "@/lib/content/home"
import { getWhatsAppNumber } from "@/lib/env"

export function QuickFlow() {
  const whatsappNumber = getWhatsAppNumber()

  return (
    // flow-root keeps the card's negative margin from dragging this grey band over the hero.
    <nav aria-label="Quick links" className="flow-root bg-gray-50">
      <div className="relative z-10 mx-auto -mt-3 max-w-[1440px] px-5 md:-mt-7 md:px-8 xl:px-12">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-brand-sm">
          <ul className="flex snap-x divide-x divide-gray-200 overflow-x-auto pr-10 [scrollbar-width:none] xl:grid xl:grid-cols-5 xl:pr-0 [&::-webkit-scrollbar]:hidden">
            {QUICK_FLOW.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.label} className="w-60 shrink-0 snap-start xl:w-auto">
                  <Link
                    {...actionLinkProps(item.action, whatsappNumber)}
                    className="flex h-14 items-center justify-center gap-2.5 px-3 text-sm font-medium whitespace-nowrap text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500"
                  >
                    <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                      <Icon className="size-[18px] text-orange-500" strokeWidth={1.75} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          {/* Shows there is more to scroll. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white to-transparent xl:hidden" />
        </div>
      </div>
    </nav>
  )
}
