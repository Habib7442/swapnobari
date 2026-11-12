import { NextResponse, type NextRequest } from "next/server"
import { isAdLive, recordAdEvent } from "@/lib/data/ads"
import { adEventSchema } from "@/lib/validation/tracking"

/** Beacon for banner impressions and clicks. Stores no IP or visitor data. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = adEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 })
  }

  try {
    if (!(await isAdLive(parsed.data.adId))) {
      return NextResponse.json({ error: "Not live" }, { status: 404 })
    }
    await recordAdEvent(parsed.data)
  } catch (error) {
    console.error("[track/ad] failed to record event", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
