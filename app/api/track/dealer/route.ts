import { NextResponse, type NextRequest } from "next/server"
import { isDealerApproved, recordDealerContact } from "@/lib/data/dealers"
import { dealerContactSchema } from "@/lib/validation/tracking"

/** Beacon for dealer Get Price clicks. Stores no IP or visitor data. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = dealerContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 })
  }

  try {
    if (!(await isDealerApproved(parsed.data.dealerId))) {
      return NextResponse.json({ error: "Not listed" }, { status: 404 })
    }
    await recordDealerContact(parsed.data)
  } catch (error) {
    console.error("[track/dealer] failed to record event", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
