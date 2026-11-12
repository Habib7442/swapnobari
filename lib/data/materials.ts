import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { PUBLIC_CACHE_TAGS } from "@/lib/constants"
import { createPublicClient } from "@/lib/supabase/public"

export type MaterialCategory = { id: string; name: string; slug: string; icon: string; brandCount: number }

/** Enabled material categories in admin order. RLS limits the embedded brands to active ones. */
export async function getEnabledMaterials(): Promise<MaterialCategory[]> {
  "use cache"
  cacheTag(PUBLIC_CACHE_TAGS.materials)

  try {
    const { data, error } = await createPublicClient()
      .from("material_categories")
      .select("id, name, slug, icon, brands(id)")
      .eq("is_enabled", true)
      .order("sort")
    if (error) throw error
    cacheLife("minutes")
    return data.map(({ brands, ...category }) => ({ ...category, brandCount: brands.length }))
  } catch (error) {
    console.error("[materials] failed to load", error)
    // Same reasoning as getEstimatorData: retry soon but stay prerenderable.
    cacheLife({ stale: 30, revalidate: 10, expire: 300 })
    return []
  }
}
