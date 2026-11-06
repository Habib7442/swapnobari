import { describe, expect, it } from "vitest"
import { revalidateSchema } from "@/lib/validation/revalidate"

describe("revalidateSchema", () => {
  it("accepts known cache tags", () => {
    expect(revalidateSchema.safeParse({ tags: ["estimator"] }).success).toBe(true)
  })

  it("rejects unknown, empty or malformed tag lists", () => {
    expect(revalidateSchema.safeParse({ tags: ["nope"] }).success).toBe(false)
    expect(revalidateSchema.safeParse({ tags: [] }).success).toBe(false)
    expect(revalidateSchema.safeParse({ tags: "estimator" }).success).toBe(false)
    expect(revalidateSchema.safeParse({}).success).toBe(false)
  })
})
