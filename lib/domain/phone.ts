/** Indian mobile numbers: strip spaces, +91 / 91 and a leading 0, then expect 10 digits starting 6–9. */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  return /^[6-9]\d{9}$/.test(digits) ? digits : null
}

/**
 * For controlled mobile inputs: drop a typed or pasted +91 / 0091 / 0 prefix.
 * The input runs on every keystroke, so a prefix being typed is kept (capped at its full
 * length) and stripped only once complete. A number starting 91 is ambiguous until then:
 * 10 digits stay as a number, 12 lose the prefix, 11 stay and fail validation rather than
 * being truncated into a wrong number.
 */
export function sanitizeMobileInput(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.startsWith("00")) {
    const capped = digits.slice(0, 14)
    return capped.length === 14 && capped.startsWith("0091") ? capped.slice(4) : capped
  }
  if (digits.startsWith("0")) {
    const capped = digits.slice(0, 11)
    return capped.length === 11 ? capped.slice(1) : capped
  }
  if (digits.startsWith("91")) {
    const capped = digits.slice(0, 12)
    return capped.length === 12 ? capped.slice(2) : capped
  }
  return digits.slice(0, 10)
}

/** Stored format: +91XXXXXXXXXX. */
export function toE164India(tenDigits: string): string {
  return `+91${tenDigits}`
}
