"use client"

import Link from "next/link"
import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/lib/site-config"

const linkClass = cn(
  "relative py-2 text-[15px] font-medium whitespace-nowrap text-navy-700 transition-colors duration-200 ease-brand hover:text-orange-500",
  "after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-orange-500 after:transition-transform after:duration-200 after:ease-brand hover:after:scale-x-100"
)

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

type NavLinksProps = { items: NavItem[]; more: NavItem[] }

/**
 * Desktop nav: the first links inline, the rest under "More".
 * The current path is runtime data on dynamic routes, so the active-link version streams in
 * behind <Suspense>; the fallback is the same menu without the highlight.
 */
export function NavLinks(props: NavLinksProps) {
  return (
    <Suspense fallback={<NavLinksView {...props} pathname="" />}>
      <ActiveNavLinks {...props} />
    </Suspense>
  )
}

function ActiveNavLinks(props: NavLinksProps) {
  return <NavLinksView {...props} pathname={usePathname()} />
}

function NavLinksView({ items, more, pathname }: NavLinksProps & { pathname: string }) {
  const moreActive = more.some((item) => isActive(pathname, item.href))

  return (
    <ul className="flex items-center gap-7">
      {items.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(linkClass, active && "after:scale-x-100")}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
      <li>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              linkClass,
              "group inline-flex items-center gap-1 outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 data-popup-open:text-orange-500",
              moreActive && "after:scale-x-100"
            )}
          >
            More
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-data-popup-open:rotate-180"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-44 rounded-xl border border-hairline bg-white p-1.5 shadow-brand-md ring-0"
          >
            {more.map((item) => (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} />}
                className="h-10 rounded-lg px-3 text-[15px] font-medium text-navy-700 focus:bg-cream-light focus:text-orange-600"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  )
}
