import { z } from "zod"
import { AD_DEVICES, AD_EVENT_KINDS } from "@/lib/constants"

/** Body of POST /api/track/ad. */
export const adEventSchema = z.object({
  adId: z.uuid(),
  kind: z.enum(AD_EVENT_KINDS),
  device: z.enum(AD_DEVICES),
})
export type AdEventInput = z.infer<typeof adEventSchema>

/** Body of POST /api/track/dealer. */
export const dealerContactSchema = z.object({
  dealerId: z.uuid(),
  categoryId: z.uuid().optional(),
})
export type DealerContactInput = z.infer<typeof dealerContactSchema>
