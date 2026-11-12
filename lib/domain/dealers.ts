export type DealerBadge = "sponsored" | "featured" | null

type Placement = { placement: string; startsOn: string | null; endsOn: string | null }

/** Today's date in India as YYYY-MM-DD: placement dates are Indian calendar days. */
export function indiaToday(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now)
}

/** The placement in force today. A missing date leaves that end of the range open. */
export function livePlacement({ placement, startsOn, endsOn }: Placement, today: string): DealerBadge {
  if (placement !== "sponsored" && placement !== "featured") return null
  if (startsOn && today < startsOn) return null
  if (endsOn && today > endsOn) return null
  return placement
}

type Sortable = { name: string; badge: DealerBadge }

const RANK: Record<string, number> = { sponsored: 0, featured: 1 }

/** Sponsored first, then Featured, then the rest; by name within each group. */
export function sortDealers<T extends Sortable>(dealers: T[]): T[] {
  return [...dealers].sort(
    (a, b) => (RANK[a.badge ?? ""] ?? 2) - (RANK[b.badge ?? ""] ?? 2) || a.name.localeCompare(b.name)
  )
}

export type DealerFilter = { material?: string; city?: string; brand?: string }

type Searchable = {
  citySlug: string
  serviceCitySlugs: string[]
  materials: { slug: string }[]
  brands: { slug: string }[]
}

/** Filters by slug. A dealer matches a city it is based in or serves. */
export function filterDealers<T extends Searchable>(dealers: T[], { material, city, brand }: DealerFilter): T[] {
  return dealers.filter(
    (dealer) =>
      (!material || dealer.materials.some((m) => m.slug === material)) &&
      (!brand || dealer.brands.some((b) => b.slug === brand)) &&
      (!city || dealer.citySlug === city || dealer.serviceCitySlugs.includes(city))
  )
}

/** How many dealers sell each material, keyed by material id. A dealer counts once per material. */
export function countDealersByMaterial(dealers: { materials: { id: string }[] }[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const dealer of dealers) {
    for (const id of new Set(dealer.materials.map((material) => material.id))) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  return counts
}
