export type NavItem = {
  label: string
  href: string
}

export const siteConfig = {
  name: "Swapnobari",
  tagline: "Plan · Vastu · Build",
  description:
    "Plan, budget and build your home in Silchar with Swapnobari. Vastu-aligned planning, complete construction, and trusted cement and TMT sellers near you.",
  // PLACEHOLDER: replace with the client's real phone number (AGENTS.md §14, Q4).
  // The WhatsApp number comes from the WHATSAPP_NUMBER env var (lib/env.ts).
  phone: "+910000000000",
  phoneDisplay: "+91 00000 00000",
  // PLACEHOLDER: office address (AGENTS.md §14, Q10). Local-business JSON-LD only appears once
  // streetAddress and postalCode are filled in.
  address: {
    streetAddress: "",
    locality: "Silchar",
    region: "Assam",
    postalCode: "",
  },
  // Full profile URLs (Facebook, Instagram, YouTube, Google Business Profile). Used for JSON-LD sameAs.
  social: [] as string[],
} as const

export const mainNav: NavItem[] = [
  { label: "Build Your Home", href: "/build-your-home" },
  { label: "Construction Budget", href: "/construction-budget" },
  { label: "Building Materials", href: "/building-materials" },
  { label: "Our Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/** Desktop shows the first four inline; the rest sit under "More". The mobile drawer shows all. */
export const primaryNav: NavItem[] = mainNav.slice(0, 4)
export const moreNav: NavItem[] = mainNav.slice(4)

export function phoneLink(): string {
  return `tel:${siteConfig.phone}`
}
