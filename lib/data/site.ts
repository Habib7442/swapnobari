import "server-only"
import { cacheLife } from "next/cache"

/** The Indian calendar year. Cached because `new Date()` outside a cache scope fails the prerender. */
export async function currentYear(): Promise<number> {
  "use cache"
  cacheLife("days")
  return Number(new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", year: "numeric" }).format(new Date()))
}
