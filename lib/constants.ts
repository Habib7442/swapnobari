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

/** Shown when the server fails (AGENTS.md §12). */
export const GENERIC_ERROR = "Something went wrong. Please try again or WhatsApp us."
