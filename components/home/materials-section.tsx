import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import tmtPhoto from "@/public/images/materials-tmt.webp"

export function MaterialsSection() {
  return (
    <section aria-labelledby="materials-title" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 id="materials-title" className="text-[26px] leading-tight font-bold text-navy-700 sm:text-[32px]">
            Find Building Materials Near You
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Cement, TMT/Rod and more from trusted local sellers.
          </p>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-brand-sm lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px]">
            <Image
              src={tmtPhoto}
              alt="Bundle of steel TMT reinforcement bars"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
            <ul className="flex flex-wrap gap-2" aria-label="Materials available">
              {["Cement", "TMT / Rod"].map((material) => (
                <li
                  key={material}
                  className="rounded-full border border-gray-200 bg-navy-50 px-3.5 py-1.5 text-sm font-medium text-navy-700"
                >
                  {material}
                </li>
              ))}
            </ul>
            <h3 className="text-2xl leading-snug font-semibold text-navy-700">
              Cement &amp; TMT from trusted local sellers
            </h3>
            <p className="text-base leading-relaxed text-gray-600">
              Compare brands and today&apos;s indicative prices from approved dealers in your area,
              then call or WhatsApp them directly.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/building-materials"
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-navy-700 px-6 font-semibold text-navy-700 transition-colors hover:bg-navy-50"
              >
                Find sellers
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/todays-price"
                className="inline-flex min-h-11 items-center text-[15px] font-medium text-navy-700 underline decoration-navy-700/40 underline-offset-4 hover:decoration-navy-700"
              >
                Check today&apos;s cement &amp; TMT price
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
