import "server-only"

/**
 * Verifies a Cloudflare Turnstile token. If TURNSTILE_SECRET_KEY is not set, verification is
 * skipped with a warning (so leads are never lost to a missing config); set it in production.
 */
export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set: skipping bot check")
    return true
  }
  if (!token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set("remoteip", ip)

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    })
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] }
    if (!data.success) console.warn("[turnstile] rejected", data["error-codes"])
    return data.success === true
  } catch (error) {
    // Cloudflare unreachable: fail open rather than lose a real lead; rate limiting still applies.
    console.error("[turnstile] verification request failed", error)
    return true
  }
}
