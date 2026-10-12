# Search Console and SEO go-live checklist

Domain: **https://swapnobari.in** (apex; `www` redirects to it). DNS: Cloudflare. Hosting: Vercel.

## What the site already does

| Item | Where |
|---|---|
| Titles, descriptions, canonical URLs | `lib/seo.ts` (`publicRoutes`, `pageMetadata()`) |
| Share image (WhatsApp, Facebook, X) | `public/og-image.jpg` (1200 × 628, from `og_image.png`) |
| `robots.txt` | `app/robots.ts`, blocks everything except on Vercel production; blocks `/admin`, `/api` |
| `sitemap.xml` | `app/sitemap.ts`, only routes marked `live: true` |
| Web app manifest, favicon, Apple icon | `app/manifest.ts`, `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` |
| Structured data (JSON-LD) | `lib/jsonld.ts`: Organization, WebSite, WebPage, Breadcrumb on every page; local business once the address exists |
| 404 / unbuilt pages | `app/not-found.tsx`, returns 404 and `noindex` |

## 1. Deploy (Vercel)

1. Import the repo into Vercel and deploy.
2. **Settings → Environment Variables (Production):**
   - `WHATSAPP_NUMBER` (required, the build fails without it)
   - `NEXT_PUBLIC_SITE_URL=https://swapnobari.in`
3. **Settings → Domains:** add `swapnobari.in` and `www.swapnobari.in`. Set `swapnobari.in` as primary, so `www` redirects to it.
4. In **Cloudflare → DNS**, delete the Hostinger parking records (`A 2.57.91.91`, `CNAME www`) and add the records Vercel shows, as **DNS only** (grey cloud).
5. Check that https://swapnobari.in/robots.txt shows `Allow: /` and the sitemap line. If it shows `Disallow: /`, the deployment is not the Production one.

## 2. Verify in Google Search Console

1. Go to https://search.google.com/search-console and click **Add property**, then **Domain**, and enter `swapnobari.in`.
2. Copy the **TXT record** Google gives you (`google-site-verification=...`).
3. In **Cloudflare → DNS → Add record**: Type `TXT`, Name `@`, Content = the value, TTL Auto. Save.
4. Back in Search Console, click **Verify**. It usually works within minutes.

*Fallback (only if DNS verification fails):* choose **URL prefix** `https://swapnobari.in/`, pick **HTML tag**, put the `content` value in the Vercel env var `GOOGLE_SITE_VERIFICATION`, and redeploy.

## 3. Submit the sitemap

**Search Console → Sitemaps**: enter `sitemap.xml`, then **Submit**. The status should show **Success**.

## 4. Request indexing

**URL Inspection**: paste `https://swapnobari.in/`, then click **Request indexing**. Repeat for `/construction-budget`.

## 5. Test

- Rich results: https://search.google.com/test/rich-results with `https://swapnobari.in/`
- Schema: https://validator.schema.org/ with the same URL (expect 0 errors)
- Share preview: paste the link in WhatsApp; it should show the Swapnobari image and title. If an old preview is cached, use https://developers.facebook.com/tools/debug/ and click **Scrape Again**.

## 6. Google Business Profile (biggest local win)

Create a profile at https://business.google.com for the Silchar office (category: *General contractor* or *Construction company*). It needs the real address and phone. Then:

- Add the address and PIN in `lib/site-config.ts` (`address`). This switches on the local-business JSON-LD automatically.
- Add the profile URL and social links to `siteConfig.social`.

## When a new page goes live

1. In the page: `export const metadata = pageMetadata("/path")`.
2. In `lib/seo.ts`, set `live: true` for that route.
3. After deploy, resubmit the sitemap in Search Console (optional; Google rechecks it on its own).

## After launch, check weekly

- **Pages** report: indexed vs not indexed, and why.
- **Core Web Vitals** and **HTTPS** reports.
- **Performance**: which searches show Swapnobari (e.g. "house construction Silchar", "cement price Silchar").
