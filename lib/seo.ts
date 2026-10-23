import type { Metadata, MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

/** Canonical origin, no trailing slash. Apex domain (www redirects to it in Vercel). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://swapnobari.in").replace(/\/+$/, "")

export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/** Share image for WhatsApp, Facebook, LinkedIn, X. Optimised copy of public/og_image.png. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 628,
  alt: "Swapnobari: build your home with clarity. Budget, planning, Vastu, construction and materials in Silchar.",
}

export type PublicRoute = {
  path: string
  title: string
  description: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
  /** Only live routes go in the sitemap. Flip to true when the page ships. */
  live: boolean
}

/** Every public page from PRD §4. Titles ≤ 60 chars, descriptions ≤ 155 chars. */
export const publicRoutes: PublicRoute[] = [
  {
    path: "/",
    title: "Swapnobari: Plan, Vastu & Build Your Home in Silchar",
    description: siteConfig.description,
    changeFrequency: "weekly",
    priority: 1,
    live: true,
  },
  {
    path: "/construction-budget",
    title: "House Construction Cost Calculator in Silchar",
    description:
      "Free house construction cost calculator for Silchar. See an instant cost range for Basic, Standard and Premium packages with a stage-wise breakdown.",
    changeFrequency: "monthly",
    priority: 0.9,
    live: true,
  },
  {
    path: "/build-your-home",
    title: "Build Your Home: Planning, Vastu & A–Z Construction",
    description:
      "Budget estimates, pre-construction consultation, floor plans, Vastu-aligned planning and complete house construction in Silchar.",
    changeFrequency: "monthly",
    priority: 0.9,
    live: false,
  },
  {
    path: "/building-materials",
    title: "Cement & TMT Sellers Near You in Silchar",
    description: "Find approved cement and TMT dealers in your area. Compare brands and call or WhatsApp sellers directly.",
    changeFrequency: "weekly",
    priority: 0.8,
    live: false,
  },
  {
    path: "/todays-price",
    title: "Today's Cement & TMT Price in Silchar",
    description: "Indicative cement and TMT prices by brand in Silchar, updated regularly. Get exact prices from sellers near you.",
    changeFrequency: "daily",
    priority: 0.8,
    live: false,
  },
  {
    path: "/shubh-nirman-sanskar",
    title: "Shubh Nirman Sanskar™: Auspicious Home Building",
    description:
      "Traditional rituals at every important stage of building your home, from Bhumi Shuddhi to Griha Pravesh, coordinated by Swapnobari.",
    changeFrequency: "monthly",
    priority: 0.7,
    live: false,
  },
  {
    path: "/list-your-store",
    title: "List Your Store: Become a Seller on Swapnobari",
    description: "Cement and TMT dealers: list your store for free and get enquiries from home builders in your area.",
    changeFrequency: "monthly",
    priority: 0.6,
    live: false,
  },
  {
    path: "/projects",
    title: "Our Projects: Homes Built by Swapnobari",
    description: "Completed and ongoing house construction projects by Swapnobari in Silchar and the Barak Valley.",
    changeFrequency: "monthly",
    priority: 0.7,
    live: false,
  },
  {
    path: "/about",
    title: "About Swapnobari",
    description: "Swapnobari helps families in Silchar plan, budget and build their homes with clarity, from first plan to handover.",
    changeFrequency: "yearly",
    priority: 0.5,
    live: false,
  },
  {
    path: "/contact",
    title: "Contact Swapnobari",
    description: "Call, WhatsApp or visit Swapnobari to plan your house construction in Silchar.",
    changeFrequency: "yearly",
    priority: 0.6,
    live: false,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "How Swapnobari collects, uses and protects your personal information.",
    changeFrequency: "yearly",
    priority: 0.2,
    live: false,
  },
  {
    path: "/terms",
    title: "Terms of Use",
    description: "The terms for using the Swapnobari website and services.",
    changeFrequency: "yearly",
    priority: 0.2,
    live: false,
  },
]

export function getRoute(path: string): PublicRoute {
  const route = publicRoutes.find((r) => r.path === path)
  if (!route) throw new Error(`No SEO entry for ${path} in lib/seo.ts`)
  return route
}

/** Site-wide defaults, set once in the root layout. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: getRoute("/").title,
    template: "%s | Swapnobari",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: SITE_URL }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Home construction",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
    url: SITE_URL,
    title: getRoute("/").title,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: getRoute("/").title,
    description: siteConfig.description,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
}

/** Per-page metadata: canonical URL plus matching Open Graph / Twitter tags. */
export function pageMetadata(path: string, options: { absoluteTitle?: boolean; noIndex?: boolean } = {}): Metadata {
  const route = getRoute(path)
  return {
    title: options.absoluteTitle ? { absolute: route.title } : route.title,
    description: route.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      url: absoluteUrl(path),
      title: route.title,
      description: route.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [OG_IMAGE.url],
    },
    ...(options.noIndex && { robots: { index: false, follow: true } }),
  }
}
