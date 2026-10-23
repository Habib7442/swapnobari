import "server-only"
import { randomBytes } from "node:crypto"
import { DEFAULT_DUPLICATE_WINDOW_DAYS, type LeadType } from "@/lib/constants"
import type { Estimate } from "@/lib/domain/estimate"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Json } from "@/lib/supabase/types"

/** What we snapshot on a budget-estimate lead, so the result link never changes after rate edits. */
export type BudgetEstimateDetails = {
  areaPerFloorSqft: number
  floors: number
  packageSlug: string
  cityName: string
  areaLabel: string
  estimate: Estimate | null
}

export type NewLead = {
  type: LeadType
  name: string
  /** +91XXXXXXXXXX */
  mobile: string
  cityId: string | null
  areaId: string | null
  areaOther: string | null
  details: Record<string, unknown>
  sourcePage: string | null
  sourceButton: string | null
  utm: { source?: string; medium?: string; campaign?: string; term?: string; content?: string }
  device: "mobile" | "tablet" | "desktop" | null
  ipHash: string | null
  withResultToken: boolean
}

export type SavedLead = { id: string; refCode: string; resultToken: string | null; isDuplicate: boolean }

export async function countRecentLeadsByIp(ipHash: string, minutes: number): Promise<number> {
  const since = new Date(Date.now() - minutes * 60_000).toISOString()
  const { count, error } = await createAdminClient()
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
  if (error) throw error
  return count ?? 0
}

async function getDuplicateWindowDays(): Promise<number> {
  const { data } = await createAdminClient()
    .from("site_settings")
    .select("value")
    .eq("key", "duplicate_window_days")
    .maybeSingle()
  const days = Number(data?.value)
  return Number.isFinite(days) && days > 0 ? days : DEFAULT_DUPLICATE_WINDOW_DAYS
}

async function findRecentLeadByMobile(mobile: string): Promise<string | null> {
  const days = await getDuplicateWindowDays()
  const since = new Date(Date.now() - days * 86_400_000).toISOString()
  const { data, error } = await createAdminClient()
    .from("leads")
    .select("id")
    .eq("mobile", mobile)
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

export async function insertLead(lead: NewLead): Promise<SavedLead> {
  const duplicateOf = await findRecentLeadByMobile(lead.mobile)
  const resultToken = lead.withResultToken ? randomBytes(18).toString("base64url") : null

  const { data, error } = await createAdminClient()
    .from("leads")
    .insert({
      type: lead.type,
      name: lead.name,
      mobile: lead.mobile,
      city_id: lead.cityId,
      area_id: lead.areaId,
      area_other: lead.areaOther,
      details: lead.details as Json,
      source_page: lead.sourcePage,
      source_button: lead.sourceButton,
      utm_source: lead.utm.source ?? null,
      utm_medium: lead.utm.medium ?? null,
      utm_campaign: lead.utm.campaign ?? null,
      utm_term: lead.utm.term ?? null,
      utm_content: lead.utm.content ?? null,
      device: lead.device,
      consent: true,
      is_duplicate: duplicateOf !== null,
      duplicate_of: duplicateOf,
      result_token: resultToken,
      ip_hash: lead.ipHash,
    })
    .select("id, ref_code, result_token, is_duplicate")
    .single()
  if (error) throw error
  return { id: data.id, refCode: data.ref_code, resultToken: data.result_token, isDuplicate: data.is_duplicate }
}

export type EstimateResult = {
  refCode: string
  firstName: string
  createdAt: string
  details: BudgetEstimateDetails
}

/** Public result page lookup. Returns only what the page shows: never the mobile number. */
export async function getEstimateByToken(token: string): Promise<EstimateResult | null> {
  if (!/^[A-Za-z0-9_-]{20,40}$/.test(token)) return null
  const { data, error } = await createAdminClient()
    .from("leads")
    .select("ref_code, name, created_at, details")
    .eq("result_token", token)
    .eq("type", "budget_estimate")
    .maybeSingle()
  if (error) {
    console.error("[leads] estimate lookup failed", error)
    return null
  }
  if (!data) return null
  return {
    refCode: data.ref_code,
    firstName: data.name.trim().split(/\s+/)[0] ?? "",
    createdAt: data.created_at,
    details: data.details as unknown as BudgetEstimateDetails,
  }
}
