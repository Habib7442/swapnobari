import { createHash, timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { revalidateSchema } from "@/lib/validation/revalidate"

/** Compares hashes so neither the length nor the content of the secret leaks through timing. */
function secretMatches(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}

/**
 * Called by the admin app after an edit, to refresh cached public data at once.
 * Bearer REVALIDATE_SECRET; body { tags: [...] } limited to PUBLIC_CACHE_TAGS.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected || expected.length < 32) {
    console.error("[revalidate] REVALIDATE_SECRET is missing or shorter than 32 characters")
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }

  const header = request.headers.get("authorization") ?? ""
  const provided = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!provided || !secretMatches(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = revalidateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Unknown or missing tags" }, { status: 400 })
  }

  // expire: 0 → the next visitor gets fresh data, never the stale copy.
  for (const tag of parsed.data.tags) revalidateTag(tag, { expire: 0 })
  return NextResponse.json({ revalidated: parsed.data.tags })
}
