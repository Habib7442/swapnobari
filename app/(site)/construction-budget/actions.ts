"use server"

import { redirect } from "next/navigation"
import { after } from "next/server"
import { GENERIC_ERROR, RATE_LIMIT } from "@/lib/constants"
import { getEstimatorData, type EstimatorData } from "@/lib/data/estimator"
import { countRecentLeadsByIp, insertLead, type BudgetEstimateDetails } from "@/lib/data/leads"
import { calculateEstimate, floorsLabel, formatRange, stagesAreValid } from "@/lib/domain/estimate"
import { toE164India } from "@/lib/domain/phone"
import { sendLeadAlert } from "@/lib/notify/lead-alert"
import { getRequestInfo, type RequestInfo } from "@/lib/security/request"
import { verifyTurnstile } from "@/lib/security/turnstile"
import { advisorSchema, estimateSchema, toFieldErrors, type FieldErrors } from "@/lib/validation/estimator"

export type FormState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: FieldErrors
}

const BOT_CHECK_FAILED = "We couldn't verify you're human. Please refresh the page and try again."
const TOO_MANY = "Too many requests from your network. Please wait a few minutes or WhatsApp us."
// With 0–1 cities the city is a hidden input, so its field error has nowhere to show.
const CITY_NOT_LOADED = "We couldn't load your city. Please refresh the page and try again."

function fields(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") out[key] = value
  }
  // Turnstile adds its token under this name.
  out.turnstileToken ??= out["cf-turnstile-response"] ?? ""
  return out
}

/** Bot check + per-IP rate limit. Returns an error message, or null when the request may proceed. */
async function guard(request: RequestInfo, turnstileToken: string | undefined): Promise<string | null> {
  if (!(await verifyTurnstile(turnstileToken, request.ip))) return BOT_CHECK_FAILED
  if (request.ipHash) {
    const recent = await countRecentLeadsByIp(request.ipHash, RATE_LIMIT.windowMinutes)
    if (recent >= RATE_LIMIT.maxPerWindow) return TOO_MANY
  }
  return null
}

function resolveLocation(data: EstimatorData, cityId: string, areaId: string | undefined, areaOther: string | undefined) {
  const city = data.cities.find((c) => c.id === cityId)
  const area = areaId ? data.areas.find((a) => a.id === areaId && a.cityId === cityId) : undefined
  return {
    city,
    areaId: area?.id ?? null,
    areaOther: area ? null : (areaOther ?? null),
    areaLabel: area?.name ?? areaOther ?? "",
  }
}

export async function submitEstimate(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = estimateSchema.safeParse(fields(formData))
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error)
    return { status: "error", fieldErrors, ...(fieldErrors.cityId && { message: CITY_NOT_LOADED }) }
  }
  const input = parsed.data

  let resultPath: string
  try {
    const request = await getRequestInfo()
    const blocked = await guard(request, input.turnstileToken)
    if (blocked) return { status: "error", message: blocked }

    const data = await getEstimatorData()
    const location = resolveLocation(data, input.cityId, input.areaId, input.areaOther)
    if (!location.city) {
      return { status: "error", fieldErrors: { cityId: "Choose your city." }, message: CITY_NOT_LOADED }
    }

    const rates = data.ratesByCity[location.city.id] ?? []
    const estimate =
      rates.length > 0
        ? calculateEstimate({
            areaPerFloorSqft: input.areaPerFloor,
            floors: input.floors,
            rates,
            stages: stagesAreValid(data.stages) ? data.stages : [],
            rangePercent: data.rangePercent,
          })
        : null
    const packageSlug = estimate?.packages.some((p) => p.slug === input.packageSlug)
      ? input.packageSlug
      : (estimate?.packages[0]?.slug ?? input.packageSlug)

    const details: BudgetEstimateDetails = {
      areaPerFloorSqft: input.areaPerFloor,
      floors: input.floors,
      packageSlug,
      cityName: location.city.name,
      areaLabel: location.areaLabel,
      estimate,
    }

    const mobile = toE164India(input.mobile)
    const lead = await insertLead({
      type: "budget_estimate",
      name: input.name,
      mobile,
      cityId: location.city.id,
      areaId: location.areaId,
      areaOther: location.areaOther,
      details,
      sourcePage: input.sourcePage ?? null,
      sourceButton: input.sourceButton ?? null,
      utm: {
        source: input.utmSource,
        medium: input.utmMedium,
        campaign: input.utmCampaign,
        term: input.utmTerm,
        content: input.utmContent,
      },
      device: request.device,
      ipHash: request.ipHash,
      withResultToken: true,
    })
    resultPath = `/construction-budget/estimate/${lead.resultToken}`

    const selected = estimate?.packages.find((p) => p.slug === packageSlug)
    after(() =>
      sendLeadAlert({
        refCode: lead.refCode,
        typeLabel: "Budget estimate",
        name: input.name,
        mobile,
        location: [location.areaLabel, location.city?.name].filter(Boolean).join(", "),
        isDuplicate: lead.isDuplicate,
        lines: [
          ["Built-up area", `${input.areaPerFloor.toLocaleString("en-IN")} sq ft per floor`],
          ["Floors", floorsLabel(input.floors)],
          ["Estimate", selected ? `${selected.name}: ${formatRange(selected.total)}` : "No rates set: send manually"],
          ["Source", [input.sourcePage, input.sourceButton].filter(Boolean).join(" · ") || "unknown"],
        ],
        resultPath,
      })
    )
  } catch (error) {
    console.error("[estimator] submit failed", error)
    return { status: "error", message: GENERIC_ERROR }
  }

  redirect(resultPath)
}

export async function requestAdvisor(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = advisorSchema.safeParse(fields(formData))
  if (!parsed.success) return { status: "error", fieldErrors: toFieldErrors(parsed.error) }
  const input = parsed.data

  try {
    const request = await getRequestInfo()
    const blocked = await guard(request, input.turnstileToken)
    if (blocked) return { status: "error", message: blocked }

    const data = await getEstimatorData()
    const location = resolveLocation(data, input.cityId, input.areaId, input.areaOther)
    const mobile = toE164India(input.mobile)
    const lead = await insertLead({
      type: "consultation",
      name: input.name,
      mobile,
      cityId: location.city?.id ?? null,
      areaId: location.areaId,
      areaOther: location.areaOther,
      details: { via: "estimator_advisor_form" },
      sourcePage: input.sourcePage ?? null,
      sourceButton: input.sourceButton ?? null,
      utm: {
        source: input.utmSource,
        medium: input.utmMedium,
        campaign: input.utmCampaign,
        term: input.utmTerm,
        content: input.utmContent,
      },
      device: request.device,
      ipHash: request.ipHash,
      withResultToken: false,
    })

    after(() =>
      sendLeadAlert({
        refCode: lead.refCode,
        typeLabel: "Consultation",
        name: input.name,
        mobile,
        location: [location.areaLabel, location.city?.name].filter(Boolean).join(", "),
        isDuplicate: lead.isDuplicate,
        lines: [["Source", [input.sourcePage, input.sourceButton].filter(Boolean).join(" · ") || "unknown"]],
      })
    )

    return { status: "success", message: lead.refCode }
  } catch (error) {
    console.error("[advisor] submit failed", error)
    return { status: "error", message: GENERIC_ERROR }
  }
}
