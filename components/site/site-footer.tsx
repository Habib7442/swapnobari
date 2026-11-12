import Link from "next/link"
import { Globe, MapPin, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Logo } from "@/components/site/logo"
import { HOME_SERVICES } from "@/lib/content/home"
import { getEnabledMaterials } from "@/lib/data/materials"
import { currentYear } from "@/lib/data/site"
import { getRoute, liveNav } from "@/lib/seo"
import { hasPhone, phoneLink, siteConfig } from "@/lib/site-config"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

const link =
  "inline-flex min-h-11 items-center gap-2 text-sm text-gray-500 transition-colors hover:text-navy-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 md:min-h-8"
const heading = "text-sm font-semibold text-navy-700"

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
].filter((item) => getRoute(item.href).live)

const SOCIAL_NAMES: Record<string, string> = {
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "youtube.com": "YouTube",
  "g.page": "Google Business Profile",
}

function socialName(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "")
  return SOCIAL_NAMES[host] ?? host
}

export async function SiteFooter({ whatsappNumber }: { whatsappNumber: string }) {
  const [materials, year] = await Promise.all([getEnabledMaterials(), currentYear()])
  const { streetAddress, locality, region, postalCode } = siteConfig.address
  const place = [streetAddress, locality, region, postalCode].filter(Boolean).join(", ")

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 md:grid-cols-3 md:gap-10 md:px-8 md:py-12 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.2fr] xl:px-12">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Logo className="min-h-11" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
            Plan, budget and build your home with clarity, from first plan to handover.
          </p>
          {siteConfig.social.length > 0 && (
            <ul className="mt-3 flex gap-2">
              {siteConfig.social.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialName(url)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-gray-200 text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    <Globe aria-hidden="true" className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Quick links" className="lg:order-1">
          <h2 className={heading}>Quick Links</h2>
          <ul className="mt-2">
            <li>
              <Link href="/" className={link}>
                Home
              </Link>
            </li>
            {liveNav().map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/todays-price" className={link}>
                Today&apos;s Price
              </Link>
            </li>
          </ul>
        </nav>

        {/* After Quick Links in the DOM so the two sit side by side on phones; fourth on desktop. */}
        {materials.length > 0 && (
          <nav aria-label="Building materials" className="lg:order-3">
            <h2 className={heading}>Building Materials</h2>
            <ul className="mt-2">
              {materials.map((material) => (
                <li key={material.id}>
                  <Link href={`/building-materials?material=${material.slug}`} className={link}>
                    {material.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav aria-label="Services" className="col-span-2 md:col-span-1 lg:order-2">
          <h2 className={heading}>Services</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {HOME_SERVICES.map((service) => (
              <li key={service.title}>
                <Link href="/#services" className={link}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-1 lg:order-4">
          <h2 className={heading}>Contact</h2>
          <address className="mt-2 not-italic">
            <ul>
              <li>
                <a
                  href={whatsappUrl(whatsappNumber, whatsappMessage("general"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  <WhatsAppIcon className="size-4 shrink-0 text-green-500" />
                  Chat on WhatsApp
                </a>
              </li>
              {hasPhone && (
                <li>
                  <a href={phoneLink()} className={link}>
                    <Phone aria-hidden="true" className="size-4 shrink-0 text-navy-500" />
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
              )}
              {place && (
                <li className="flex min-h-11 items-center gap-2 text-sm text-gray-500 md:min-h-8">
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-navy-500" />
                  {place}
                </li>
              )}
            </ul>
          </address>
        </div>
      </div>

      <div className="border-t border-gray-200">
        {/* md+: room for the floating WhatsApp button (56px at bottom-6). */}
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-1 px-5 py-4 text-center text-sm text-gray-500 md:flex-row md:justify-between md:px-8 md:pb-24 md:text-left xl:px-12">
          <p>© {year} Swapnobari</p>
          {LEGAL.length > 0 && (
            <ul className="flex items-center gap-2">
              {LEGAL.map((item, index) => (
                <li key={item.href} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">·</span>}
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
