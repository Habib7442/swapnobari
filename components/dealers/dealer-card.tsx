import Image from "next/image"
import { BadgeCheck, MapPin } from "lucide-react"
import { DealerGetPrice } from "@/components/dealers/dealer-get-price"
import type { PublicDealer } from "@/lib/data/dealers"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

type DealerCardProps = {
  dealer: PublicDealer
  whatsappNumber: string
  /** The material being searched for, if any. */
  materialSlug?: string
}

const pill = "inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap"

export function DealerCard({ dealer, whatsappNumber, materialSlug }: DealerCardProps) {
  const location = [dealer.area, dealer.city].filter(Boolean).join(", ")
  const searched = dealer.materials.find((material) => material.slug === materialSlug)
  const only = dealer.materials.length === 1 ? dealer.materials[0] : undefined
  const material = searched ?? only
  const message = whatsappMessage("dealerEnquiry", {
    dealer: dealer.name,
    material: material?.name ?? dealer.materials.map((m) => m.name).join(", "),
    area: location,
  })

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-brand-sm transition-shadow hover:shadow-brand-md">
      <div className="flex gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-navy-50">
          {dealer.photoUrl ? (
            <Image src={dealer.photoUrl} alt={`${dealer.name} shop`} fill sizes="64px" className="object-cover" />
          ) : (
            <span aria-hidden="true" className="flex size-full items-center justify-center text-2xl font-bold text-navy-700">
              {dealer.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base leading-snug font-semibold text-navy-700">{dealer.name}</h3>
          <p className="mt-1 flex items-start gap-1 text-sm text-gray-600">
            <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-gray-500" />
            {location}
          </p>
          {(dealer.badge || dealer.isVerified) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {dealer.badge === "sponsored" && <span className={`${pill} bg-gray-200 text-gray-800`}>Sponsored</span>}
              {dealer.badge === "featured" && <span className={`${pill} bg-navy-700 text-white`}>Featured</span>}
              {dealer.isVerified && (
                <span className={`${pill} bg-step-blue/15 text-navy-700`}>
                  <BadgeCheck aria-hidden="true" className="size-3.5 text-step-blue" />
                  Verified
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <dl className="flex-1 space-y-1 text-sm">
        {dealer.materials.length > 0 && (
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-navy-700">Sells:</dt>
            <dd className="text-gray-600">{dealer.materials.map((m) => m.name).join(", ")}</dd>
          </div>
        )}
        {dealer.brands.length > 0 && (
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-medium text-navy-700">Brands:</dt>
            <dd className="text-gray-600">{dealer.brands.map((b) => b.name).join(", ")}</dd>
          </div>
        )}
      </dl>

      <DealerGetPrice href={whatsappUrl(whatsappNumber, message)} dealerId={dealer.id} categoryId={material?.id} />
    </article>
  )
}
