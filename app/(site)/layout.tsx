import { SiteHeader } from "@/components/site/site-header"
import { getWhatsAppNumber } from "@/lib/env"

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <SiteHeader whatsappNumber={getWhatsAppNumber()} />
      {/* Header is fixed; pages start under it. */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
