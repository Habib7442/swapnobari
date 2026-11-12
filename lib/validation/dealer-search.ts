import { z } from "zod"
import type { DealerFilter } from "@/lib/domain/dealers"

const slug = z
  .string()
  .regex(/^[a-z0-9-]{1,80}$/)
  .optional()
  .catch(undefined)

const dealerSearchSchema = z.object({ material: slug, city: slug, brand: slug })

/** Reads ?material=&city=&brand=. Anything invalid is ignored, not an error. */
export function parseDealerSearch(params: Record<string, string | string[] | undefined>): DealerFilter {
  return dealerSearchSchema.parse(params)
}
