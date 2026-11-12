import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { PUBLIC_CACHE_TAGS } from "@/lib/constants"
import { createPublicClient } from "@/lib/supabase/public"

export type PriceRow = {
  id: string
  city: string
  material: string
  brand: string
  /** Whole rupees. */
  price: number
  unit: string
  updatedAt: string
}

export type PublicPrices = { rows: PriceRow[]; failed: boolean }

/** Visible prices sorted by city, material, brand. RLS hides hidden cities, brands and categories. */
export async function getPublicPrices(): Promise<PublicPrices> {
  "use cache"
  cacheTag(PUBLIC_CACHE_TAGS.prices)

  try {
    const { data, error } = await createPublicClient()
      .from("prices")
      .select("id, price, unit, updated_at, cities(name), brands(name), material_categories(name)")
    if (error) throw error

    const rows = data.flatMap((row): PriceRow[] => {
      if (!row.cities || !row.brands || !row.material_categories) return []
      return [
        {
          id: row.id,
          city: row.cities.name,
          material: row.material_categories.name,
          brand: row.brands.name,
          price: row.price,
          unit: row.unit,
          updatedAt: row.updated_at,
        },
      ]
    })
    rows.sort(
      (a, b) =>
        a.city.localeCompare(b.city) || a.material.localeCompare(b.material) || a.brand.localeCompare(b.brand)
    )

    cacheLife("minutes")
    return { rows, failed: false }
  } catch (error) {
    console.error("[prices] failed to load", error)
    // Same reasoning as getEstimatorData: retry soon but stay prerenderable.
    cacheLife({ stale: 30, revalidate: 10, expire: 300 })
    return { rows: [], failed: true }
  }
}
