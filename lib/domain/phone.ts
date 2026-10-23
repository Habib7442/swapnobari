/** Indian mobile numbers: strip spaces, +91 / 91 and a leading 0, then expect 10 digits starting 6–9. */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  return /^[6-9]\d{9}$/.test(digits) ? digits : null
}

/** Stored format: +91XXXXXXXXXX. */
export function toE164India(tenDigits: string): string {
  return `+91${tenDigits}`
}
