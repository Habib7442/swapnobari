import { z } from "zod"
import { ESTIMATOR } from "@/lib/constants"
import { normalizeIndianMobile } from "@/lib/domain/phone"

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined))

const mobile = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalized = normalizeIndianMobile(value)
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid 10-digit mobile number." })
      return z.NEVER
    }
    return normalized
  })

const name = z.string().trim().min(2, "Enter your name.").max(60, "Name is too long.")

const consent = z.literal("on", { message: "Please agree to be contacted." })

/** Shared tracking fields sent as hidden inputs. */
const tracking = {
  sourcePage: optionalText(200),
  sourceButton: optionalText(60),
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
  utmTerm: optionalText(100),
  utmContent: optionalText(100),
  turnstileToken: optionalText(4096),
}

const location = {
  cityId: z.uuid("Choose your city."),
  areaId: z.uuid().optional().or(z.literal("").transform(() => undefined)),
  areaOther: optionalText(120),
}

export const estimateSchema = z
  .object({
    areaPerFloor: z.coerce
      .number({ message: "Enter the built-up area in sq ft." })
      .int("Use whole square feet.")
      .min(ESTIMATOR.minAreaSqft, `Enter at least ${ESTIMATOR.minAreaSqft} sq ft.`)
      .max(ESTIMATOR.maxAreaSqft, `Enter up to ${ESTIMATOR.maxAreaSqft.toLocaleString("en-IN")} sq ft.`),
    floors: z.coerce
      .number({ message: "Choose the number of floors." })
      .int()
      .refine((value) => ESTIMATOR.floorOptions.some((o) => o.value === value), "Choose the number of floors."),
    packageSlug: z.string().trim().max(40).default(ESTIMATOR.defaultPackage),
    name,
    mobile,
    consent,
    ...location,
    ...tracking,
  })
  .refine((data) => data.areaId || data.areaOther, {
    message: "Enter your area or locality.",
    path: ["areaOther"],
  })

export type EstimateInput = z.infer<typeof estimateSchema>

export const advisorSchema = z.object({
  name,
  mobile,
  consent,
  ...location,
  ...tracking,
})

export type AdvisorInput = z.infer<typeof advisorSchema>

/** Field-level errors keyed by input name, for useActionState. */
export type FieldErrors = Partial<Record<string, string>>

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    out[key] ??= issue.message
  }
  return out
}
