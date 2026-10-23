import { describe, expect, it } from "vitest"
import { calculateEstimate, formatLakh, formatRange, stagesAreValid, type Stage } from "@/lib/domain/estimate"
import { normalizeIndianMobile } from "@/lib/domain/phone"

const stages: Stage[] = [
  { name: "Foundation", percent: 12, groundFloorOnly: true },
  { name: "Structure", percent: 48, groundFloorOnly: false },
  { name: "Finishing", percent: 40, groundFloorOnly: false },
]

const rates = [
  { slug: "basic", name: "Basic", tagline: null, ratePerSqft: 1600 },
  { slug: "standard", name: "Standard", tagline: null, ratePerSqft: 2000 },
]

describe("calculateEstimate", () => {
  const estimate = calculateEstimate({ areaPerFloorSqft: 1000, floors: 2, rates, stages, rangePercent: 10 })
  const standard = estimate.packages.find((p) => p.slug === "standard")!

  it("multiplies area × floors × rate and applies the range", () => {
    expect(estimate.totalAreaSqft).toBe(2000)
    expect(standard.total).toEqual({ low: 3_600_000, mid: 4_000_000, high: 4_400_000 })
  })

  it("splits stages by percentage and they add up to the total", () => {
    expect(standard.stages.map((s) => s.amount)).toEqual([480_000, 1_920_000, 1_600_000])
    expect(standard.stages.reduce((sum, s) => sum + s.amount, 0)).toBe(standard.total.mid)
  })

  it("puts ground-floor-only stages on the ground floor and shares the rest", () => {
    // groundOnly = 12% of 40L = 4.8L; shared = 35.2L / 2 = 17.6L
    expect(standard.floors).toEqual([
      { label: "Ground floor", amount: 2_240_000 },
      { label: "Floor 1", amount: 1_760_000 },
    ])
  })

  it("skips packages without a positive rate", () => {
    const result = calculateEstimate({
      areaPerFloorSqft: 1000,
      floors: 1,
      rates: [...rates, { slug: "premium", name: "Premium", tagline: null, ratePerSqft: 0 }],
      stages,
      rangePercent: 10,
    })
    expect(result.packages.map((p) => p.slug)).toEqual(["basic", "standard"])
  })

  it("rejects invalid input", () => {
    expect(() => calculateEstimate({ areaPerFloorSqft: 0, floors: 1, rates, stages, rangePercent: 10 })).toThrow()
    expect(() => calculateEstimate({ areaPerFloorSqft: 1000, floors: 0, rates, stages, rangePercent: 10 })).toThrow()
  })
})

describe("formatting", () => {
  it("formats lakh and crore", () => {
    expect(formatLakh(4_000_000)).toBe("₹40L")
    expect(formatLakh(3_825_000)).toBe("₹38.3L")
    expect(formatLakh(12_500_000)).toBe("₹1.25Cr")
    expect(formatLakh(85_000)).toBe("₹85,000")
    expect(formatRange({ low: 3_600_000, mid: 4_000_000, high: 4_400_000 })).toBe("₹36L – ₹44L")
  })
})

describe("stagesAreValid", () => {
  it("requires a total of 100", () => {
    expect(stagesAreValid(stages)).toBe(true)
    expect(stagesAreValid(stages.slice(1))).toBe(false)
  })
})

describe("normalizeIndianMobile", () => {
  it("accepts common formats", () => {
    expect(normalizeIndianMobile("98765 43210")).toBe("9876543210")
    expect(normalizeIndianMobile("+91 98765-43210")).toBe("9876543210")
    expect(normalizeIndianMobile("09876543210")).toBe("9876543210")
  })
  it("rejects invalid numbers", () => {
    expect(normalizeIndianMobile("1234567890")).toBeNull()
    expect(normalizeIndianMobile("98765")).toBeNull()
  })
})
