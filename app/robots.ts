import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

/**
 * Production (Vercel "production" env): crawl everything except admin and API.
 * Previews and local builds: block all, so preview URLs never reach Google.
 * Cloudflare's Bot Preference Sync prepends its own AI-crawler rules to this file.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
