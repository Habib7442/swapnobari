import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { PUBLIC_CACHE_TAGS } from "@/lib/constants"
import { getEstimatorData } from "@/lib/data/estimator"
import { getEnabledMaterials } from "@/lib/data/materials"
import { indiaToday, livePlacement, sortDealers, type DealerBadge } from "@/lib/domain/dealers"
import { createAdminClient } from "@/lib/supabase/admin"
import { createPublicClient } from "@/lib/supabase/public"
import type { DealerContactInput } from "@/lib/validation/tracking"

export type DealerTag = { id: string; name: string; slug: string }

/** Only columns the public may read: never a phone number, owner name or admin note. */
export type PublicDealer = {
  id: string
  name: string
  area: string | null
  city: string
  citySlug: string
  serviceCitySlugs: string[]
  photoUrl: string | null
  isVerified: boolean
  badge: DealerBadge
  materials: DealerTag[]
  brands: DealerTag[]
}

export type PublicDealers = { dealers: PublicDealer[]; failed: boolean }

const SELECT = `id, business_name, photo_path, is_verified, placement, placement_starts_on, placement_ends_on,
  cities(name, slug),
  areas!dealers_area_id_fkey(name),
  dealer_service_areas(areas(cities(slug))),
  dealer_materials(material_categories(id, name, slug)),
  dealer_brands(brands(id, name, slug))`

/** Approved dealers (RLS), Sponsored first. Placement dates are checked here, in Indian time. */
export async function getPublicDealers(): Promise<PublicDealers> {
  "use cache"
  cacheTag(PUBLIC_CACHE_TAGS.dealers, PUBLIC_CACHE_TAGS.materials)

  try {
    const { data, error } = await createPublicClient().from("dealers").select(SELECT)
    if (error) throw error

    const today = indiaToday(new Date())
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const dealers = data.flatMap((row): PublicDealer[] => {
      if (!row.cities) return []
      return [
        {
          id: row.id,
          name: row.business_name,
          area: row.areas?.name ?? null,
          city: row.cities.name,
          citySlug: row.cities.slug,
          serviceCitySlugs: row.dealer_service_areas.flatMap((s) => (s.areas?.cities ? [s.areas.cities.slug] : [])),
          photoUrl: row.photo_path ? `${base}/storage/v1/object/public/public-images/${row.photo_path}` : null,
          isVerified: row.is_verified,
          badge: livePlacement(
            { placement: row.placement, startsOn: row.placement_starts_on, endsOn: row.placement_ends_on },
            today
          ),
          materials: row.dealer_materials.flatMap((m) => (m.material_categories ? [m.material_categories] : [])),
          brands: row.dealer_brands.flatMap((b) => (b.brands ? [b.brands] : [])),
        },
      ]
    })

    cacheLife("minutes")
    return { dealers: sortDealers(dealers), failed: false }
  } catch (error) {
    console.error("[dealers] failed to load", error)
    // Same reasoning as getEstimatorData: retry soon but stay prerenderable.
    cacheLife({ stale: 30, revalidate: 10, expire: 300 })
    return { dealers: [], failed: true }
  }
}

export type SearchOption = { slug: string; name: string }
export type BrandOption = SearchOption & { materialSlug: string }
export type SearchOptions = { materials: SearchOption[]; cities: SearchOption[]; brands: BrandOption[] }

async function getActiveBrands(): Promise<{ slug: string; name: string; categoryId: string }[]> {
  "use cache"
  cacheTag(PUBLIC_CACHE_TAGS.materials)

  try {
    const { data, error } = await createPublicClient()
      .from("brands")
      .select("slug, name, category_id")
      .order("sort")
      .order("name")
    if (error) throw error
    cacheLife("minutes")
    return data.map((brand) => ({ slug: brand.slug, name: brand.name, categoryId: brand.category_id }))
  } catch (error) {
    console.error("[dealers] failed to load brands", error)
    // Same reasoning as getEstimatorData: retry soon but stay prerenderable.
    cacheLife({ stale: 30, revalidate: 10, expire: 300 })
    return []
  }
}

/** Choices for the seller search: enabled materials, active cities, brands of those materials. */
export async function getSearchOptions(): Promise<SearchOptions> {
  const [materials, { cities }, brands] = await Promise.all([
    getEnabledMaterials(),
    getEstimatorData(),
    getActiveBrands(),
  ])
  const materialSlugById = new Map(materials.map((material) => [material.id, material.slug]))

  return {
    materials: materials.map(({ slug, name }) => ({ slug, name })),
    cities: cities.map(({ slug, name }) => ({ slug, name })),
    brands: brands.flatMap((brand) => {
      const materialSlug = materialSlugById.get(brand.categoryId)
      return materialSlug ? [{ slug: brand.slug, name: brand.name, materialSlug }] : []
    }),
  }
}

/** Not cached: a dealer removed from the site must stop counting at once. */
export async function isDealerApproved(dealerId: string): Promise<boolean> {
  const { data, error } = await createPublicClient().from("dealers").select("id").eq("id", dealerId).maybeSingle()
  if (error) throw error
  return data !== null
}

export async function recordDealerContact(contact: DealerContactInput): Promise<void> {
  const { error } = await createAdminClient()
    .from("dealer_contact_events")
    .insert({ dealer_id: contact.dealerId, kind: "whatsapp", category_id: contact.categoryId ?? null })
  if (error) throw error
}
