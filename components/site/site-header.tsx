"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { MobileNav } from "@/components/site/mobile-nav"
import { NavLinks } from "@/components/site/nav-links"
import { cn } from "@/lib/utils"
import { mainNav, moreNav, primaryNav } from "@/lib/site-config"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

const SCROLL_THRESHOLD = 20

export function SiteHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-[250ms] ease-out",
        scrolled
          ? "border-navy-900/[0.06] bg-white/88 shadow-[0_6px_24px_rgba(15,31,58,0.06)] backdrop-blur-[14px] backdrop-saturate-[140%]"
          : "border-transparent bg-transparent shadow-none"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1440px] items-center justify-between gap-10 px-5 transition-[height] duration-[250ms] ease-out md:px-8 xl:px-12",
          scrolled ? "h-[68px]" : "h-[84px]"
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden min-[1200px]:block">
          <NavLinks items={primaryNav} more={moreNav} />
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={whatsappUrl(whatsappNumber, whatsappMessage("enquiry"))}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden h-11 shrink-0 items-center gap-2 rounded-full bg-navy-700 pr-1.5 pl-5 text-[15px] font-semibold whitespace-nowrap text-white transition duration-150 ease-brand hover:-translate-y-px hover:bg-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:inline-flex"
          >
            Enquire Now
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15">
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-150 ease-brand group-hover:translate-x-0.5"
              />
            </span>
          </a>
          <div className="min-[1200px]:hidden">
            <MobileNav items={mainNav} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </div>
    </header>
  )
}
