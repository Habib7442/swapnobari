import type {
  BreadcrumbList,
  FAQPage,
  GeneralContractor,
  Organization,
  Service,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts"
import { siteConfig } from "@/lib/site-config"
import { OG_IMAGE, SITE_URL, absoluteUrl } from "@/lib/seo"

/**
 * Structured data (schema.org JSON-LD). Rules:
 * - Never publish placeholder or invented data (no fake phone, address, ratings or reviews).
 * - Every entity has a stable @id so pages can reference the same organisation.
 */

const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`
const BUSINESS_ID = `${SITE_URL}/#business`
const LOGO_URL = absoluteUrl("/icon.png")

const AREA_SERVED = [
  { "@type": "City" as const, name: "Silchar" },
  { "@type": "AdministrativeArea" as const, name: "Barak Valley, Assam" },
]

export type JsonLdThing = WithContext<
  Organization | WebSite | GeneralContractor | WebPage | BreadcrumbList | Service | FAQPage
>

export function organizationJsonLd(whatsappNumber: string): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: "স্বপ্নবাড়ি",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: "512", height: "512" },
    image: absoluteUrl(OG_IMAGE.url),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    areaServed: AREA_SERVED,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${whatsappNumber}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Bengali", "Hindi"],
    },
    ...(siteConfig.social.length > 0 && { sameAs: [...siteConfig.social] }),
  }
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  }
}

/**
 * Local business markup for Google. Returns null until a real street address is set in
 * site-config, because Google needs a genuine address for local results (AGENTS.md §14, Q10).
 */
export function localBusinessJsonLd(whatsappNumber: string): WithContext<GeneralContractor> | null {
  const { address } = siteConfig
  if (!address.streetAddress || !address.postalCode) return null
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": BUSINESS_ID,
    name: siteConfig.name,
    url: SITE_URL,
    logo: LOGO_URL,
    image: absoluteUrl(OG_IMAGE.url),
    description: siteConfig.description,
    telephone: `+${whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
    areaServed: AREA_SERVED,
    parentOrganization: { "@id": ORG_ID },
    ...(siteConfig.social.length > 0 && { sameAs: [...siteConfig.social] }),
  }
}

export function webPageJsonLd(path: string, name: string, description: string): WithContext<WebPage> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(OG_IMAGE.url) },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function serviceJsonLd(service: { name: string; description: string; path: string }): WithContext<Service> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
    serviceType: "Home construction",
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

/** JSON.stringify with `<` escaped so stored content can never close the script tag (Next.js JSON-LD guide). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
