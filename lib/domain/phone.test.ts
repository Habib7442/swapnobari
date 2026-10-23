import { describe, expect, it } from "vitest"
import { normalizeIndianMobile, sanitizeMobileInput } from "@/lib/domain/phone"

describe("sanitizeMobileInput", () => {
  it("drops a pasted country or trunk prefix", () => {
    expect(sanitizeMobileInput("+91 98765 43210")).toBe("9876543210")
    expect(sanitizeMobileInput("919876543210")).toBe("9876543210")
    expect(sanitizeMobileInput("0091 98765 43210")).toBe("9876543210")
    expect(sanitizeMobileInput("098765-43210")).toBe("9876543210")
  })

  it("keeps plain input and partial typing as is", () => {
    expect(sanitizeMobileInput("98765 43210")).toBe("9876543210")
    expect(sanitizeMobileInput("98765")).toBe("98765")
    expect(sanitizeMobileInput("")).toBe("")
  })

  it("keeps a prefix while it is being typed, then strips it", () => {
    const type = (keys: string): string =>
      [...keys].reduce((value, key) => sanitizeMobileInput(value + key), "")
    expect(type("919876543210")).toBe("9876543210")
    expect(type("09876543210")).toBe("9876543210")
    expect(type("00919876543210")).toBe("9876543210")
  })

  it("keeps a 10-digit number that starts with 91", () => {
    expect(sanitizeMobileInput("9198765432")).toBe("9198765432")
  })

  it("leaves an 11-digit 91… entry untruncated so validation rejects it", () => {
    expect(sanitizeMobileInput("91987654321")).toBe("91987654321")
    expect(normalizeIndianMobile("91987654321")).toBeNull()
  })

  it("caps input at 10 digits when there is no prefix", () => {
    expect(sanitizeMobileInput("98765432109")).toBe("9876543210")
  })
})
