import { describe, expect, it } from "vitest"
import { countDealersByMaterial, filterDealers, indiaToday, livePlacement, sortDealers, type DealerBadge } from "@/lib/domain/dealers"

describe("indiaToday", () => {
  it("uses the Indian date, not UTC", () => {
    expect(indiaToday(new Date("2026-11-10T19:00:00Z"))).toBe("2026-11-11")
  })
})

describe("livePlacement", () => {
  const sponsored = { placement: "sponsored", startsOn: "2026-11-01", endsOn: "2026-11-30" }

  it("is live on the first and last day", () => {
    expect(livePlacement(sponsored, "2026-11-01")).toBe("sponsored")
    expect(livePlacement(sponsored, "2026-11-30")).toBe("sponsored")
  })

  it("is off before the start and after the end", () => {
    expect(livePlacement(sponsored, "2026-10-31")).toBeNull()
    expect(livePlacement(sponsored, "2026-12-01")).toBeNull()
  })

  it("treats a missing date as open-ended", () => {
    expect(livePlacement({ placement: "featured", startsOn: null, endsOn: null }, "2030-01-01")).toBe("featured")
  })

  it("is null when there is no placement", () => {
    expect(livePlacement({ placement: "none", startsOn: null, endsOn: null }, "2026-11-11")).toBeNull()
  })
})

describe("sortDealers", () => {
  it("puts sponsored first, then featured, then by name", () => {
    const dealers: { name: string; badge: DealerBadge }[] = [
      { name: "Zed", badge: null },
      { name: "Bee", badge: "featured" },
      { name: "Ace", badge: null },
      { name: "Cob", badge: "sponsored" },
    ]
    expect(sortDealers(dealers).map((d) => d.name)).toEqual(["Cob", "Bee", "Ace", "Zed"])
  })
})

describe("filterDealers", () => {
  const dealer = {
    id: "a",
    citySlug: "silchar",
    serviceCitySlugs: ["hailakandi"],
    materials: [{ slug: "cement" }],
    brands: [{ slug: "ultratech" }],
  }

  it("returns everything with no filter", () => {
    expect(filterDealers([dealer], {})).toHaveLength(1)
  })

  it("matches the home city or a served city", () => {
    expect(filterDealers([dealer], { city: "silchar" })).toHaveLength(1)
    expect(filterDealers([dealer], { city: "hailakandi" })).toHaveLength(1)
    expect(filterDealers([dealer], { city: "guwahati" })).toHaveLength(0)
  })

  it("requires every filter to match", () => {
    expect(filterDealers([dealer], { material: "cement", brand: "ultratech" })).toHaveLength(1)
    expect(filterDealers([dealer], { material: "cement", brand: "acc" })).toHaveLength(0)
    expect(filterDealers([dealer], { material: "tmt" })).toHaveLength(0)
  })
})

describe("countDealersByMaterial", () => {
  it("counts each dealer once per material it sells", () => {
    const counts = countDealersByMaterial([
      { materials: [{ id: "cement" }, { id: "tmt" }] },
      { materials: [{ id: "cement" }, { id: "cement" }] },
      { materials: [] },
    ])
    expect(counts.get("cement")).toBe(2)
    expect(counts.get("tmt")).toBe(1)
    expect(counts.get("sand")).toBeUndefined()
  })
})
