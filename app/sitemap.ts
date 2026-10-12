import type { MetadataRoute } from "next"
import { absoluteUrl, publicRoutes } from "@/lib/seo"

/** Only live pages. Add dynamic entries (dealers, projects) here once those tables exist. */
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes
    .filter((route) => route.live)
    .map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
}
