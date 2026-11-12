/** Single source for enums and limits (AGENTS.md §12). Keep in sync with the leads table checks. */

export const LEAD_TYPES = [
  "budget_estimate",
  "consultation",
  "floor_plan",
  "vastu",
  "az_construction",
  "plan_review",
  "shubh_nirman",
  "material_price",
  "dealer_enquiry",
  "general_contact",
] as const
export type LeadType = (typeof LEAD_TYPES)[number]

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "consultation_scheduled",
  "quoted",
  "won",
  "lost",
  "not_reachable",
  "duplicate",
] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const ESTIMATOR = {
  minAreaSqft: 200,
  maxAreaSqft: 20000,
  /** Floors offered in the form: value = number of floors including ground. */
  floorOptions: [
    { value: 1, label: "Ground only (G)" },
    { value: 2, label: "G+1" },
    { value: 3, label: "G+2" },
    { value: 4, label: "G+3" },
  ],
  defaultPackage: "standard",
  defaultRangePercent: 10,
} as const

export const RATE_LIMIT = {
  /** Max lead submissions per IP inside the window. */
  maxPerWindow: 5,
  windowMinutes: 10,
} as const

export const DEFAULT_DUPLICATE_WINDOW_DAYS = 30

/**
 * States, cities and areas. Hidden = off the website, kept for old leads.
 * Twin of LOCATION_STATUSES in swapnobari-admin/lib/constants.ts: keep in sync.
 */
export const LOCATION_STATUSES = ["active", "coming_soon", "hidden"] as const
export type LocationStatus = (typeof LOCATION_STATUSES)[number]

/**
 * Cache tags the admin app may refresh via POST /api/revalidate.
 * Twin of PUBLIC_CACHE_TAGS in swapnobari-admin/lib/constants.ts: keep in sync.
 */
export const PUBLIC_CACHE_TAGS = {
  estimator: "estimator",
  materials: "materials",
  dealers: "dealers",
  prices: "prices",
  ads: "ads",
} as const
export type PublicCacheTag = (typeof PUBLIC_CACHE_TAGS)[keyof typeof PUBLIC_CACHE_TAGS]

/**
 * Material category icons: keys of a fixed Lucide list (map in lib/material-icons.ts).
 * Twin of MATERIAL_ICON_KEYS in swapnobari-admin/lib/constants.ts; matches the material_categories.icon check.
 */
export const MATERIAL_ICON_KEYS = [
  "bag",
  "bars",
  "bricks",
  "stone",
  "tiles",
  "electrical",
  "plumbing",
  "paint",
  "tools",
  "boxes",
] as const
export type MaterialIconKey = (typeof MATERIAL_ICON_KEYS)[number]

/** Dealer listing status. Only approved dealers are visible on the website (public AGENTS.md §4). */
export const DEALER_STATUSES = ["pending", "approved", "rejected"] as const
export type DealerStatus = (typeof DEALER_STATUSES)[number]

/** Featured = the client's pick; Sponsored = paid, always labelled "Sponsored". Live between its dates. */
export const DEALER_PLACEMENTS = ["none", "featured", "sponsored"] as const
export type DealerPlacement = (typeof DEALER_PLACEMENTS)[number]

/** Ad slots (DESIGN.md §9), seeded as ad_slots rows; matches the ad_slots.key check. */
export const AD_SLOT_KEYS = ["home_banner", "home_materials_side", "materials_top", "materials_side"] as const
export type AdSlotKey = (typeof AD_SLOT_KEYS)[number]

/** Every paid banner carries one of these labels (public AGENTS.md §4). */
export const AD_LABELS = ["advertisement", "sponsored"] as const
export type AdLabel = (typeof AD_LABELS)[number]

/** ad_events.kind and ad_events.device checks. */
export const AD_EVENT_KINDS = ["impression", "click"] as const
export type AdEventKind = (typeof AD_EVENT_KINDS)[number]
export const AD_DEVICES = ["mobile", "desktop", "tablet"] as const

/** Shown when the server fails (AGENTS.md §12). */
export const GENERIC_ERROR = "Something went wrong. Please try again or WhatsApp us."
