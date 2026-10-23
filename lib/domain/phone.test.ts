import { describe, expect, it } from "vitest"
import { sanitizeMobileInput } from "@/lib/domain/phone"

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

  it("truncates one extra typed digit instead of treating 91 as a prefix", () => {
    expect(sanitizeMobileInput("91987654321")).toBe("9198765432")
  })
})
