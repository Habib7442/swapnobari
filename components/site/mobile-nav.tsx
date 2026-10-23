"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  Calculator,
  ChevronRight,
  HardHat,
  House,
  LayoutGrid,
  Menu,
  MessageSquareText,
  Package,
  Phone,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Logo } from "@/components/site/logo"
import { cn } from "@/lib/utils"
import { phoneLink, type NavItem } from "@/lib/site-config"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

const ICONS: Record<string, LucideIcon> = {
  "/": House,
  "/build-your-home": HardHat,
  "/construction-budget": Calculator,
  "/building-materials": Package,
  "/projects": LayoutGrid,
  "/about": Users,
  "/contact": MessageSquareText,
}

type MobileNavProps = { items: NavItem[]; whatsappNumber: string }

/** See NavLinks: the active highlight streams in behind <Suspense> on dynamic routes. */
export function MobileNav(props: MobileNavProps) {
  return (
    <Suspense fallback={<MobileNavView {...props} pathname="" />}>
      <ActiveMobileNav {...props} />
    </Suspense>
  )
}

function ActiveMobileNav(props: MobileNavProps) {
  return <MobileNavView {...props} pathname={usePathname()} />
}

function MobileNavView({ items, whatsappNumber, pathname }: MobileNavProps & { pathname: string }) {
  const [open, setOpen] = useState(false)
  const links: NavItem[] = [{ label: "Home", href: "/" }, ...items]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-full border border-navy-700/10 bg-white/90 text-navy-700 shadow-brand-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-l-0 data-[side=right]:w-[88%] bg-white p-0 shadow-[-24px_0_60px_rgba(15,31,58,0.18)] data-[side=right]:max-w-[380px] data-[side=right]:sm:max-w-[380px]"
      >
        {/* Header */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-hairline px-5">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
          <SheetClose
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-[12px] bg-field text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <X className="size-5" />
          </SheetClose>
        </div>

        {/* Links */}
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pt-4 pb-2 [@media(max-height:760px)]:pt-2">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500">MENU</p>
          <ul className="flex flex-col gap-1">
            {links.map((item, index) => {
              const active = pathname === item.href
              const Icon = ICONS[item.href] ?? ChevronRight
              return (
                <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${60 + index * 35}ms` }}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex min-h-14 items-center gap-3.5 rounded-[14px] px-3 transition-colors [@media(max-height:760px)]:min-h-12",
                      active ? "bg-orange-50" : "hover:bg-cream-light active:bg-cream-light"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] transition-colors [@media(max-height:760px)]:size-9",
                        active ? "bg-orange-500 text-white" : "bg-cream-light text-navy-700 group-hover:bg-white"
                      )}
                    >
                      <Icon className="size-[19px]" strokeWidth={1.75} />
                    </span>
                    <span className={cn("flex-1 text-[16px] font-medium", active ? "text-orange-600" : "text-navy-700")}>
                      {item.label}
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn(
                        "size-[18px] transition-transform duration-150 group-hover:translate-x-0.5",
                        active ? "text-orange-500" : "text-slate-400"
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Estimate promo */}
          <Link
            href="/construction-budget"
            onClick={() => setOpen(false)}
            className="group relative mx-1 mt-5 block animate-fade-up [@media(max-height:760px)]:mt-3 overflow-hidden rounded-[16px] bg-navy-700 p-4 text-white [animation-delay:320ms]"
          >
            <span aria-hidden="true" className="absolute -top-10 -right-10 size-32 rounded-full bg-white/[0.06]" />
            <span aria-hidden="true" className="absolute -right-4 -bottom-12 size-24 rounded-full bg-orange-500/20" />
            <span className="relative block text-[11px] font-semibold tracking-[0.14em] text-orange-50/80">
              FREE ESTIMATE
            </span>
            <span className="relative mt-1 block font-display text-[20px] leading-tight font-medium">
              Know your construction budget
            </span>
            <span className="relative mt-3 inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-orange-500 px-4 text-sm font-semibold transition-colors group-hover:bg-orange-600">
              Get Free Estimate
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </nav>

        {/* Contact */}
        <div className="shrink-0 border-t border-hairline px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="pb-3 text-[13px] text-slate-600 [@media(max-height:760px)]:hidden">Talk to us before you start.</p>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={phoneLink()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-gray-200 bg-white text-[15px] font-semibold text-navy-700 transition-colors hover:bg-cream-light"
            >
              <Phone aria-hidden="true" className="size-[18px]" />
              Call
            </a>
            <a
              href={whatsappUrl(whatsappNumber, whatsappMessage("general"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-green-500 text-[15px] font-semibold text-white transition-colors hover:bg-green-600"
            >
              <WhatsAppIcon className="size-[18px]" />
              WhatsApp
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
