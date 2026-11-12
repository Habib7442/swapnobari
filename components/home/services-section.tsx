import type { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import { Section } from "@/components/site/section"
import { SectionHeader } from "@/components/site/section-header"
import { CARD_TINTS, HOME_SERVICES, actionLinkProps } from "@/lib/content/home"
import { getWhatsAppNumber } from "@/lib/env"
import { cn } from "@/lib/utils"

const ZOOM = "transition-transform duration-200 ease-brand group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"

export function ServicesSection(): ReactElement {
  const whatsappNumber = getWhatsAppNumber()

  return (
    <Section id="services" labelledBy="services-title" background="gray-50">
      <SectionHeader
        id="services-title"
        eyebrow="What We Do"
        title="Our Services"
        subtitle="Simple Solutions for Your Home Construction Journey"
      />

      {/* Below md: a swipe carousel. The -mx/px pair lets cards run to the screen edge. */}
      <ul className="-mx-5 mt-8 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 py-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:p-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {HOME_SERVICES.map((service, index) => {
          const Icon = service.icon
          const tint = CARD_TINTS[index % CARD_TINTS.length]
          return (
            <li
              key={service.title}
              className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-brand-sm transition duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-brand-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:w-auto"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
                {service.image ? (
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
                    className={cn("object-cover", ZOOM)}
                  />
                ) : (
                  <div className={cn("flex size-full items-center justify-center", tint?.panel, ZOOM)}>
                    <Icon aria-hidden="true" strokeWidth={1.5} className={cn("size-10", tint?.icon)} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[17px] leading-snug font-semibold text-navy-700 md:text-lg">{service.title}</h3>
                <p className="mt-2 mb-5 line-clamp-2 text-[15px] leading-relaxed text-gray-500">{service.text}</p>
                <Link
                  {...actionLinkProps(service.action, whatsappNumber)}
                  className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-navy-700 bg-white px-3 text-sm font-semibold whitespace-nowrap text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  {service.button}
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
