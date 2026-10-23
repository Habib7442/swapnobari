import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { ESTIMATOR } from "@/lib/constants"
import type { PackageRate, Stage } from "@/lib/domain/estimate"
import { createPublicClient } from "@/lib/supabase/public"

/**
 * Public estimator reference data. Cached ("minutes" profile) and tagged so the admin panel can
 * revalidate it after edits. On failure it logs and returns empty data, so pages still render and
 * the form still saves leads (the result then says "we'll send your estimate").
 */

export const ESTIMATOR_CACHE_TAG = "estimator"

export type City = { id: string; name: string; slug: string }
export type Area = { id: string; cityId: string; name: string }
export type Package = { id: string; slug: string; name: string; tagline: string | null; sort: number }
export type PackageFeature = { packageSlug: string; label: string; value: string; sort: number }

export type EstimatorData = {
  cities: City[]
  areas: Area[]
  packages: Package[]
  /** Rates per city id. A package without a rate for a city is simply absent. */
  ratesByCity: Record<string, PackageRate[]>
  features: PackageFeature[]
  stages: Stage[]
  rangePercent: number
  disclaimer: string
}

const EMPTY: EstimatorData = {
  cities: [],
  areas: [],
  packages: [],
  ratesByCity: {},
  features: [],
  stages: [],
  rangePercent: ESTIMATOR.defaultRangePercent,
  disclaimer: "Approximate estimate. Final cost depends on design, site and materials.",
}

export async function getEstimatorData(): Promise<EstimatorData> {
  "use cache"
  cacheLife("minutes")
  cacheTag(ESTIMATOR_CACHE_TAG)

  try {
    const supabase = createPublicClient()
    const [cities, areas, packages, rates, features, stages, settings] = await Promise.all([
      supabase.from("cities").select("id, name, slug, status").eq("status", "active").order("sort"),
      supabase.from("areas").select("id, city_id, name").order("sort").order("name"),
      supabase.from("budget_packages").select("id, slug, name, tagline, sort").order("sort"),
      supabase.from("budget_rates").select("city_id, package_id, rate_per_sqft"),
      supabase.from("budget_package_features").select("package_id, label, value, sort").order("sort"),
      supabase.from("budget_stages").select("name, percent, ground_floor_only, sort").order("sort"),
      supabase.from("site_settings").select("key, value").in("key", ["estimate_range_percent", "estimate_disclaimer"]),
    ])

    const firstError = [cities, areas, packages, rates, features, stages, settings].find((r) => r.error)?.error
    if (firstError) throw firstError

    const packageRows: Package[] = (packages.data ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      sort: p.sort,
    }))
    const packageById = new Map(packageRows.map((p) => [p.id, p]))

    const ratesByCity: Record<string, PackageRate[]> = {}
    for (const rate of rates.data ?? []) {
      const pkg = packageById.get(rate.package_id)
      if (!pkg) continue
      ;(ratesByCity[rate.city_id] ??= []).push({
        slug: pkg.slug,
        name: pkg.name,
        tagline: pkg.tagline,
        ratePerSqft: rate.rate_per_sqft,
      })
    }
    for (const list of Object.values(ratesByCity)) {
      list.sort((a, b) => (packageRows.find((p) => p.slug === a.slug)?.sort ?? 0) - (packageRows.find((p) => p.slug === b.slug)?.sort ?? 0))
    }

    const setting = (key: string) => settings.data?.find((s) => s.key === key)?.value
    const range = Number(setting("estimate_range_percent"))
    const disclaimer = setting("estimate_disclaimer")

    return {
      cities: (cities.data ?? []).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      areas: (areas.data ?? []).map((a) => ({ id: a.id, cityId: a.city_id, name: a.name })),
      packages: packageRows,
      ratesByCity,
      features: (features.data ?? []).flatMap((f) => {
        const pkg = packageById.get(f.package_id)
        return pkg ? [{ packageSlug: pkg.slug, label: f.label, value: f.value, sort: f.sort }] : []
      }),
      stages: (stages.data ?? []).map((s) => ({
        name: s.name,
        percent: Number(s.percent),
        groundFloorOnly: s.ground_floor_only,
      })),
      rangePercent: Number.isFinite(range) && range >= 0 ? range : EMPTY.rangePercent,
      disclaimer: typeof disclaimer === "string" && disclaimer ? disclaimer : EMPTY.disclaimer,
    }
  } catch (error) {
    console.error("[estimator] failed to load reference data", error)
    return EMPTY
  }
}
