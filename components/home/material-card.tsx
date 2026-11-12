import { createElement, type ReactElement } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { MaterialCategory } from "@/lib/data/materials"
import { materialIcon } from "@/lib/material-icons"
import { cn } from "@/lib/utils"

type MaterialCardProps = { material: MaterialCategory; sellerCount: number }

const TILE = "flex h-full min-h-[76px] items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"

/** A category tile. Links to the seller search only when approved sellers exist. */
export function MaterialCard({ material, sellerCount }: MaterialCardProps): ReactElement {
  const live = sellerCount > 0
  const icon = (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-xl",
        live ? "bg-navy-50 text-navy-700" : "bg-gray-50 text-gray-500"
      )}
    >
      {createElement(materialIcon(material.icon), { className: "size-6", strokeWidth: 1.75 })}
    </span>
  )

  if (!live) {
    return (
      <div aria-disabled="true" className={TILE}>
        {icon}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-gray-600">{material.name}</span>
          <span className="mt-1 inline-flex h-6 items-center rounded-full bg-status-neutral-bg px-2.5 text-xs font-medium text-status-neutral">
            Coming soon
          </span>
        </span>
      </div>
    )
  }

  return (
    <Link
      href={`/building-materials?material=${material.slug}`}
      className={cn(
        TILE,
        "group shadow-brand-sm transition-shadow hover:shadow-brand-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      )}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-navy-700">{material.name}</span>
        <span className="block text-[13px] text-gray-500">
          {sellerCount} {sellerCount === 1 ? "seller" : "sellers"}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="hidden size-4 shrink-0 text-gray-500 transition-transform group-hover:translate-x-0.5 sm:block motion-reduce:transition-none"
      />
    </Link>
  )
}
