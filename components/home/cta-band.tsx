import type { ReactElement } from "react"
import Link from "next/link"
import { ArrowRight, House } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Section } from "@/components/site/section"
import { getWhatsAppNumber } from "@/lib/env"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

const BUTTON =
  "h-12 items-center justify-center gap-2 rounded-[10px] px-6 font-semibold whitespace-nowrap text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
const ESTIMATE = `${BUTTON} bg-orange-500 hover:bg-orange-600`

export function CtaBand(): ReactElement {
  const estimateLabel = (
    <>
      Get Free Estimate
      <ArrowRight aria-hidden="true" className="size-4" />
    </>
  )

  return (
    <Section labelledBy="cta-title" background="navy-900">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <span aria-hidden="true" className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
            <House strokeWidth={1.75} className="size-6 text-white" />
          </span>
          <div>
            <h2 id="cta-title" className="text-[24px] leading-tight font-bold text-white sm:text-[28px]">
              Planning to Build a House?
            </h2>
            <p className="mt-2 text-base text-white/80">
              Talk to Us Before You Start. Get the right plan, budget and Vastu guidance.
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          {/* The hero form exists only at md+; on phones the estimate has its own page. */}
          <Link href="/construction-budget" className={`flex md:hidden ${ESTIMATE}`}>
            {estimateLabel}
          </Link>
          <Link href="/#budget" className={`hidden md:inline-flex ${ESTIMATE}`}>
            {estimateLabel}
          </Link>
          <a
            href={whatsappUrl(getWhatsAppNumber(), whatsappMessage("enquiry"))}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex bg-green-500 hover:bg-green-600 ${BUTTON}`}
          >
            <WhatsAppIcon className="size-5" />
            Enquire Now on WhatsApp
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </Section>
  )
}
