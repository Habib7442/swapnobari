import { FloatingWhatsApp } from "@/components/site/floating-whatsapp"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { getWhatsAppNumber } from "@/lib/env"
import { liveNav } from "@/lib/seo"

export default function SiteLayout({ children }: LayoutProps<"/">) {
  const whatsappNumber = getWhatsAppNumber()

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <SiteHeader whatsappNumber={whatsappNumber} nav={liveNav()} />
      {/* Header is fixed; pages start under it. */}
      <main className="flex-1">{children}</main>
      <SiteFooter whatsappNumber={whatsappNumber} />
      <FloatingWhatsApp whatsappNumber={whatsappNumber} />
    </div>
  )
}
