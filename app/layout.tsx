import type { Metadata, Viewport } from "next"
import { Fraunces, Inter } from "next/font/google"
import { JsonLd } from "@/components/seo/json-ld"
import { getWhatsAppNumber } from "@/lib/env"
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld"
import { defaultMetadata } from "@/lib/seo"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

// Headings (font-display). Variable font so weights 500/600, italic and the opsz axis all work.
const fraunces = Fraunces({
  variable: "--font-display-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  themeColor: "#13294B",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const whatsappNumber = getWhatsAppNumber()

  return (
    // Browser extensions (e.g. Testim, Grammarly) inject attributes on <html> and <body> before
    // hydration. This only ignores those two elements' own attributes, not their children.
    <html
      lang="en-IN"
      className={`${inter.variable} ${fraunces.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <JsonLd
          data={[
            organizationJsonLd(whatsappNumber),
            websiteJsonLd(),
            localBusinessJsonLd(whatsappNumber),
          ]}
        />
        {children}
      </body>
    </html>
  )
}
