import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeIndianRupee, Check, Compass, ShieldCheck, type LucideIcon } from "lucide-react"
import { BudgetCard } from "@/components/home/budget-card"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { getWhatsAppNumber } from "@/lib/env"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"
import heroBg from "@/public/hero_bg.webp"
import heroBgMobile from "@/public/hero_bg_mobile.webp"

const trustItems = ["Transparent budget", "Vastu-aligned planning", "Verified sellers"]
const trustIcons: Record<string, LucideIcon> = {
  "Transparent budget": BadgeIndianRupee,
  "Vastu-aligned planning": Compass,
  "Verified sellers": ShieldCheck,
}

export function Hero() {
  const whatsappNumber = getWhatsAppNumber()

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-cream-light md:min-h-[92svh] md:flex-row md:items-center lg:min-h-[max(92svh,720px)]"
    >
      {/* <768px: portrait photo, house anchored to the bottom, text over the sky. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 md:hidden">
        <div className="absolute inset-0 animate-kenburns will-change-transform">
          <Image
            src={heroBgMobile}
            alt=""
            fill
            priority
            quality={85}
            placeholder="blur"
            sizes="(min-width: 768px) 1px, 100vw"
            className="object-cover object-bottom [filter:saturate(0.9)_hue-rotate(-4deg)]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.7)_0%,rgba(250,247,242,0.35)_35%,rgba(250,247,242,0)_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(14,31,58,0.3)_0%,rgba(14,31,58,0)_22%)]" />
      </div>

      {/* ≥768px: landscape photo. The 1px `sizes` below 768px keeps phones from downloading it. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block">
        <div className="absolute inset-0 animate-kenburns will-change-transform">
          <Image
            src={heroBg}
            alt=""
            fill
            priority
            quality={85}
            placeholder="blur"
            sizes="(max-width: 767px) 1px, 100vw"
            className="object-cover object-[72%_center] [filter:contrast(1.05)_saturate(1.08)]"
          />
        </div>
        {/* 768–1023px: vertical wash so stacked text stays readable. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.85)_0%,rgba(250,247,242,0.2)_100%)] lg:hidden" />
        {/* ≥1024px: light left wash, top wash for the navbar, navy vignette to ground the lawn. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(250,247,242,0.80)_0%,rgba(250,247,242,0.55)_28%,rgba(250,247,242,0.12)_46%,rgba(250,247,242,0)_60%)] lg:block" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(250,247,242,0.45)_0%,rgba(250,247,242,0)_20%)] lg:block" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,rgba(14,31,58,0.28)_0%,rgba(14,31,58,0)_30%)] lg:block" />
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 pt-[100px] pb-4 md:px-8 md:pt-[120px] md:pb-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-16 xl:px-12">
        {/* Desktop: top-aligned with the card (not centred) so the text sits higher, over the clearer sky.
            min-w-0: grid items default to min-width:auto, so the nowrap pill row would widen the page. */}
        <div className="max-w-[580px] min-w-0 lg:self-start lg:pt-2">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-navy-700/[0.08] bg-white/90 px-3.5 py-2 text-[13px] font-medium text-navy-700">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-orange-500" />
            Home construction in Silchar, Assam
          </p>

          <h1
            id="hero-title"
            className="mt-4 animate-fade-up font-display text-[clamp(36px,10vw,40px)] leading-[1.04] font-medium tracking-[-0.025em] text-navy-700 [animation-delay:80ms] md:mt-5 md:text-[clamp(42px,4.6vw,68px)]"
          >
            Build your <em className="font-medium italic">dream home</em> with clarity and care
          </h1>

          <p className="mt-4 max-w-[480px] animate-fade-up text-[17px] leading-[1.6] font-medium text-gray-800 [animation-delay:160ms] md:mt-5 md:text-[19px] lg:[text-shadow:0_1px_14px_rgba(250,247,242,0.85)]">
            From budget planning to Vastu-aligned construction, everything under one roof.
          </p>

          {/* <768px: estimate (to its own page; no form on the mobile home) and WhatsApp on one line. */}
          <div className="mt-6 flex animate-fade-up gap-2.5 [animation-delay:240ms] md:hidden">
            <Link
              href="/construction-budget"
              className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-orange-500 px-3 text-sm font-semibold whitespace-nowrap text-white shadow-[0_6px_16px_rgba(242,107,29,0.25)] transition-colors active:bg-orange-600"
            >
              Get Free Estimate
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
            <a
              href={whatsappUrl(whatsappNumber, whatsappMessage("estimate"))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-green-500 px-4 text-sm font-semibold whitespace-nowrap text-white shadow-[0_6px_16px_rgba(37,162,68,0.2)] transition-colors active:bg-green-600"
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              WhatsApp
            </a>
          </div>

          <div className="mt-8 hidden animate-fade-up flex-wrap items-center gap-3 [animation-delay:240ms] md:flex">
            <Link
              href="/build-your-home"
              className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-orange-500 pr-2.5 pl-[26px] text-base font-semibold text-white transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_12px_28px_rgba(242,107,29,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
            >
              Plan My Project
              <span className="inline-flex size-[34px] items-center justify-center rounded-full bg-white/20">
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-[3px]"
                />
              </span>
            </Link>
            <a
              href={whatsappUrl(whatsappNumber, whatsappMessage("general"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-green-500 px-6 text-base font-semibold text-white transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-[0_12px_28px_rgba(37,162,68,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
            >
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </a>
          </div>

          <ul className="mt-9 hidden animate-fade-up flex-wrap gap-3 [animation-delay:320ms] md:flex xl:flex-nowrap">
            {trustItems.map((item) => {
              const Icon = trustIcons[item] ?? Check
              return (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 py-1.5 pr-3.5 pl-1.5 text-sm font-medium whitespace-nowrap text-gray-800 shadow-brand-sm backdrop-blur-[8px]"
                >
                  <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-orange-50">
                    <Icon className="size-4 text-orange-600" strokeWidth={1.75} />
                  </span>
                  {item}
                </li>
              )
            })}
          </ul>
        </div>

        <BudgetCard whatsappNumber={whatsappNumber} className="hidden w-full animate-fade-up [animation-delay:520ms] md:block md:max-w-[560px] lg:w-[380px] lg:max-w-none" />
      </div>

      {/* <768px: keeps the house in view below the text. */}
      <div aria-hidden="true" className="min-h-[200px] flex-1 md:hidden" />

      {/* <768px: trust badges as a frosted strip over the lawn, all three visible at once. */}
      <ul className="mx-5 mb-5 grid animate-fade-up grid-cols-3 divide-x divide-navy-700/10 rounded-[14px] border border-white/70 bg-white/85 py-3 shadow-brand-md backdrop-blur-md [animation-delay:320ms] md:hidden">
        {trustItems.map((item) => {
          const Icon = trustIcons[item] ?? Check
          return (
            <li key={item} className="flex flex-col items-center gap-1.5 px-2 text-center">
              <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-full bg-orange-50">
                <Icon className="size-[18px] text-orange-600" strokeWidth={1.75} />
              </span>
              <span className="text-xs leading-tight font-medium text-gray-800">{item}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
