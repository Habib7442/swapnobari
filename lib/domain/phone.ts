/** Indian mobile numbers: strip spaces, +91 / 91 and a leading 0, then expect 10 digits starting 6–9. */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  return /^[6-9]\d{9}$/.test(digits) ? digits : null
}

/**
 * For controlled mobile inputs: drop a pasted +91 / 0091 / 0 prefix, keep at most 10 digits.
 * Prefixes are stripped only at their exact lengths, so one extra typed digit on a number
 * that happens to start with 91 or 0 is truncated, not mistaken for a prefix.
 */
export function sanitizeMobileInput(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  if (digits.length === 14 && digits.startsWith("0091")) digits = digits.slice(4)
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2)
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  return digits.slice(0, 10)
}

/** Stored format: +91XXXXXXXXXX. */
export function toE164India(tenDigits: string): string {
  return `+91${tenDigits}`
}
