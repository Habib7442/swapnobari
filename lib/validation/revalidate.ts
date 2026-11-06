import { z } from "zod"
import { PUBLIC_CACHE_TAGS } from "@/lib/constants"

const tags = Object.values(PUBLIC_CACHE_TAGS) as [string, ...string[]]

/** Body of POST /api/revalidate: 1–20 known cache tags. */
export const revalidateSchema = z.object({
  tags: z.array(z.enum(tags)).min(1).max(20),
})
