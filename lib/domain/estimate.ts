/**
 * Construction cost estimate (pure, no I/O).
 * total = built-up area per floor × floors × rate(package); shown as a ± range, never one number.
 */

export type PackageRate = {
  slug: string
  name: string
  tagline: string | null
  ratePerSqft: number
}

export type Stage = {
  name: string
  percent: number
  /** Cost that belongs only to the ground floor (e.g. foundation). */
  groundFloorOnly: boolean
}

export type EstimateInput = {
  areaPerFloorSqft: number
  floors: number
  rates: PackageRate[]
  stages: Stage[]
  rangePercent: number
}

export type Range = { low: number; mid: number; high: number }

export type PackageEstimate = {
  slug: string
  name: string
  tagline: string | null
  ratePerSqft: number
  total: Range
  stages: { name: string; percent: number; amount: number }[]
  floors: { label: string; amount: number }[]
}

export type Estimate = {
  areaPerFloorSqft: number
  floors: number
  totalAreaSqft: number
  rangePercent: number
  packages: PackageEstimate[]
}

const round = (value: number): number => Math.round(value)

export function floorLabel(index: number): string {
  return index === 0 ? "Ground floor" : `Floor ${index}`
}

export function floorsLabel(floors: number): string {
  return floors <= 1 ? "G" : `G+${floors - 1}`
}

/** Splits `base` across floors: ground-floor-only stages go to the ground floor, the rest is shared equally. */
function floorBreakdown(base: number, floors: number, stages: Stage[]): PackageEstimate["floors"] {
  const groundOnlyPercent = stages.filter((s) => s.groundFloorOnly).reduce((sum, s) => sum + s.percent, 0)
  const groundOnly = (base * groundOnlyPercent) / 100
  const sharedPerFloor = (base - groundOnly) / floors
  return Array.from({ length: floors }, (_, i) => ({
    label: floorLabel(i),
    amount: round(sharedPerFloor + (i === 0 ? groundOnly : 0)),
  }))
}

export function calculateEstimate(input: EstimateInput): Estimate {
  const { areaPerFloorSqft, floors, rates, stages, rangePercent } = input
  if (!Number.isFinite(areaPerFloorSqft) || areaPerFloorSqft <= 0) throw new Error("Area must be positive")
  if (!Number.isInteger(floors) || floors < 1) throw new Error("Floors must be a positive integer")

  const totalAreaSqft = areaPerFloorSqft * floors
  const spread = Math.max(0, rangePercent) / 100

  const packages = rates
    .filter((rate) => rate.ratePerSqft > 0)
    .map((rate): PackageEstimate => {
      const base = totalAreaSqft * rate.ratePerSqft
      return {
        slug: rate.slug,
        name: rate.name,
        tagline: rate.tagline,
        ratePerSqft: rate.ratePerSqft,
        total: { low: round(base * (1 - spread)), mid: round(base), high: round(base * (1 + spread)) },
        stages: stages.map((stage) => ({
          name: stage.name,
          percent: stage.percent,
          amount: round((base * stage.percent) / 100),
        })),
        floors: floorBreakdown(base, floors, stages),
      }
    })

  return { areaPerFloorSqft, floors, totalAreaSqft, rangePercent: Math.max(0, rangePercent), packages }
}

/** Stage percentages must add up to 100 (± rounding) for the breakdown to reconcile with the total. */
export function stagesAreValid(stages: Stage[]): boolean {
  const total = stages.reduce((sum, s) => sum + s.percent, 0)
  return stages.length > 0 && Math.abs(total - 100) < 0.01
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 })

/** ₹12,50,000 */
export function formatRupees(amount: number): string {
  return `₹${inr.format(round(amount))}`
}

/** ₹38.2L, ₹1.25Cr, or ₹85,000 for small amounts. */
export function formatLakh(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${trim(amount / 1_00_00_000, 2)}Cr`
  if (amount >= 1_00_000) return `₹${trim(amount / 1_00_000, 1)}L`
  return formatRupees(amount)
}

function trim(value: number, digits: number): string {
  return value.toFixed(digits).replace(/\.?0+$/, "")
}

export function formatRange(range: Range): string {
  return `${formatLakh(range.low)} – ${formatLakh(range.high)}`
}
