# Prompt: SEO foundation, JSON-LD and Search Console readiness

> **Built 12 Oct 2026.** Differences from this plan: the share image is the user's `public/og_image.png` (optimised to `public/og-image.jpg`, 1200 × 628, 140 KB) instead of a generated `opengraph-image.tsx`; favicons are the user's `favicon_io` set already in `app/`. Organization JSON-LD uses the real WhatsApp number (from `WHATSAPP_NUMBER`) as its contact point; the `GeneralContractor` block stays off until a real address is set. Unused `public/favicon_io/site.webmanifest` (empty name) removed in favour of `app/manifest.ts`.

## Goal

Add one typed SEO layer (`lib/seo.ts`), typed JSON-LD builders (`lib/jsonld.ts`) and every Next.js file Google Search Console needs (`robots`, `sitemap`, `manifest`, icons, Open Graph image, verification meta, canonical URLs) so swapnobari.in can be verified and indexed cleanly from day one.

## Read

- `AGENTS.md` §§1–2, 7, 8, 11, 12, 14
- `PRD.md` §4 (site map), §13 (GA4 + Search Console), §14 (SEO: page per service and city, editable meta, sitemap.xml, local business structured data)
- `DESIGN.md` §2 (brand), §3 (colours)
- Next.js local docs:
  - `02-guides/json-ld.md`: render `<script type="application/ld+json">` in layout/page; escape `<` as `<`; optional `schema-dts` typing
  - `03-api-reference/03-file-conventions/01-metadata/`: `sitemap.md`, `robots.md`, `manifest.md`, `app-icons.md`, `opengraph-image.md`
  - `03-api-reference/04-functions/generate-metadata.md`: `title.template` + required `title.default`, `metadataBase`, `alternates.canonical`, `openGraph`, `twitter`, `robots`, `verification` (→ `google-site-verification` meta), "With Cache Components"
  - `03-api-reference/04-functions/generate-viewport.md`: `themeColor` belongs in `viewport`, not `metadata`

## Code inspected

- `app/layout.tsx`: static `metadata` with "Create Next App" title, no `metadataBase`
- `app/favicon.ico`: the default Next.js favicon (wrong brand in search results)
- No `robots`, `sitemap`, `manifest`, OG image or JSON-LD exist
- `prompts/home-navbar-hero.md` (pending approval) also edits `app/layout.tsx` and adds `lib/site-config.ts`. This prompt builds on that file (see decision 1).

## Decisions and assumptions (review these)

1. **Order:** run this **after** `home-navbar-hero.md`, which creates `lib/site-config.ts` (name, tagline, placeholder phone/WhatsApp). SEO reads brand facts from it, so there is one source of truth. If the hero prompt is rejected, this prompt creates `lib/site-config.ts` itself.
2. **Canonical domain:** `https://swapnobari.in` (apex, no `www`), from `NEXT_PUBLIC_SITE_URL` with that as fallback. `www` → apex redirect is set in Vercel domain settings (manual step), not in code.
3. **Only live pages go in the sitemap.** Today that is only `/`. Every other route in the PRD site map is listed in `lib/seo.ts` with `live: false` and is flipped to `true` as each page ships. A sitemap full of 404s creates Search Console errors.
4. **Never index non-production.** `robots.ts` returns `Disallow: /` unless `VERCEL_ENV === "production"` (preview deployments stay out of Google). Production: allow `/`, disallow `/admin` and `/api`.
5. **JSON-LD types:**
   - Site-wide (root layout): `Organization` + `WebSite`, linked by `@id`.
   - Business: `GeneralContractor` (a schema.org `LocalBusiness` subtype under `HomeAndConstructionBusiness`), with `areaServed: Silchar, Assam`. **Emitted only once a real phone and address are configured.** We don't publish placeholder `+91 00000 00000` or a fake address to Google (`AGENTS.md` §14 Q4, Q10).
   - Builders ready for later pages, not used yet: `BreadcrumbList`, `Service` (the six services), `FAQPage`.
   - No `WebSite.potentialAction` SearchAction, since there's no site search yet.
6. **Verification:** support both methods.
   - Recommended: **Domain property** via DNS TXT record in Cloudflare (covers apex + www + http/https). No code needed.
   - Fallback: URL-prefix property via meta tag from env `GOOGLE_SITE_VERIFICATION`. The tag renders only when the variable is set.
7. **Open Graph image:** generated with `app/opengraph-image.tsx` (`next/og` `ImageResponse`, 1200 × 630): navy-700 background, "Swapnobari" wordmark, tagline, "Silchar, Assam" line, orange accent bar. No photo needed. Replace later with a real-photo version if wanted.
8. **Icons:** replace the Next.js favicon with a brand placeholder `app/icon.svg` (simple house mark, navy with an orange roof stroke) + `app/apple-icon.png` (180 × 180, generated from the same mark via `apple-icon.tsx` `ImageResponse`). Swap for the real logo when supplied.
9. **Language:** `<html lang="en-IN">`, `openGraph.locale = "en_IN"`.
10. **Typing:** add `schema-dts` as a **devDependency** (types only, zero runtime) for the JSON-LD builders.
11. **Out of this prompt:** GA4 (separate prompt, needs consent wording), `llms.txt`, hreflang (English only in V1), dynamic sitemap entries for dealers/projects/cities (added when those tables exist), per-page meta editable from admin (added with `site_settings`).

## Files to create or modify

Create:

- `lib/seo.ts`
  - `SITE_URL`, `absoluteUrl(path)`
  - `publicRoutes`: `{ path, title, description, changeFrequency, priority, live }[]` for every PRD §4 page (Home, Build Your Home, Construction Budget, Building Materials, List Your Store, Today's Cement & TMT Price, Shubh Nirman Sanskar, Our Projects, About Us, Contact, Privacy Policy, Terms)
  - `defaultMetadata: Metadata`: `metadataBase`, `title { default, template: "%s | Swapnobari" }`, description, `applicationName`, `openGraph` (type website, siteName, locale en_IN, url), `twitter` (`summary_large_image`), `robots` (index/follow + `googleBot` `max-image-preview: large`), `formatDetection { telephone: false }`, `verification.google` from env when set
  - `pageMetadata({ title, description, path, image?, noIndex? }): Metadata`: sets canonical `alternates.canonical`, OG/Twitter title/description/url per page
- `lib/jsonld.ts`
  - builders: `organizationJsonLd()`, `websiteJsonLd()`, `localBusinessJsonLd()` (returns `null` until phone + address are real), `breadcrumbJsonLd(items)`, `serviceJsonLd(service)`, `faqJsonLd(items)`, all typed with `schema-dts`
  - `serializeJsonLd(data)`: `JSON.stringify` + replace `<` with `<`
- `components/seo/json-ld.tsx`: server component rendering `<script type="application/ld+json">` for one or more objects (skips `null`)
- `app/robots.ts`
- `app/sitemap.ts`: from `publicRoutes.filter(r => r.live)`
- `app/manifest.ts`: name, short_name "Swapnobari", description, `start_url: "/"`, `display: "standalone"`, `theme_color` navy-700 `#13294B`, `background_color` `#FFFFFF`, icons
- `app/icon.svg`, `app/apple-icon.tsx`
- `app/opengraph-image.tsx` (+ `alt` export), reused as Twitter image via `app/twitter-image.tsx` re-export
- `.env.example`: `NEXT_PUBLIC_SITE_URL=https://swapnobari.in`, `GOOGLE_SITE_VERIFICATION=`
- `docs/search-console.md`: the go-live checklist (manual steps below), for the user and client

Modify:

- `app/layout.tsx`: `export const metadata = defaultMetadata`; `export const viewport = { themeColor: "#13294B" }`; `lang="en-IN"`; render `<JsonLd data={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]} />`
- `app/(site)/page.tsx`: `export const metadata = pageMetadata({...home})`, with title via `title.absolute` so the home title isn't suffixed
- `lib/site-config.ts`: add `address` (all fields `null` until supplied), `social` links (empty), `areaServed`
- `AGENTS.md` §11 env table: add `GOOGLE_SITE_VERIFICATION` (server only) and note `VERCEL_ENV` controls indexing
- Delete `app/favicon.ico`

Proposed copy (edit freely):

- Default title: "Swapnobari: Build Your Home in Silchar | Plan, Vastu & Construction"
- Template: "%s | Swapnobari"
- Default description (≤ 155 chars): "Plan, budget and build your home in Silchar with Swapnobari. Vastu-aligned planning, complete construction, and trusted cement and TMT sellers near you."

## Implementation requirements

- All SEO files are static (no `cookies()`/`headers()`), so they prerender under `cacheComponents`.
- Canonical URLs are absolute, apex domain, no trailing slash, no query strings.
- Every JSON-LD `@id` uses `${SITE_URL}/#organization`, `${SITE_URL}/#website`, `${SITE_URL}/#business`.
- `localBusinessJsonLd()` includes, when available: name, url, logo, image, telephone (E.164 `+91…`), `address` (`PostalAddress`, `addressLocality: "Silchar"`, `addressRegion: "Assam"`, `postalCode`, `addressCountry: "IN"`), `areaServed`, `priceRange` (only if the client agrees), `sameAs` (social links), `openingHoursSpecification` (only if given).
- No invented data anywhere: no fake ratings, reviews, prices, phone numbers or addresses in metadata or JSON-LD.
- Page titles ≤ 60 characters, descriptions ≤ 155 characters (assert in a tiny dev-only check or keep in review).

## Security requirements

- `GOOGLE_SITE_VERIFICATION` is public by nature (it's in the HTML) but stays a server env var read in metadata. No `NEXT_PUBLIC_` needed.
- JSON-LD is serialised with `<` escaped to prevent script injection once values come from the database.
- `robots.ts` blocks `/admin` and `/api`. This is a crawl hint, **not** access control (auth still guards admin).

## Acceptance criteria

- [ ] `/robots.txt` on production lists `Allow: /`, `Disallow: /admin`, `Disallow: /api`, `Sitemap: https://swapnobari.in/sitemap.xml`, and on any non-production build lists `Disallow: /`.
- [ ] `/sitemap.xml` is valid XML and contains only live routes (currently `/`).
- [ ] `/manifest.webmanifest` serves with brand name and navy theme colour.
- [ ] `<head>` on `/` has: title, description, canonical `https://swapnobari.in`, OG + Twitter tags with absolute image URL, `theme-color`, and `google-site-verification` only when the env var is set.
- [ ] `/opengraph-image` renders a 1200 × 630 branded PNG.
- [ ] Brand favicon and apple-touch icon replace the Next.js icon.
- [ ] Page source contains `Organization` + `WebSite` JSON-LD that passes the Schema Markup Validator with 0 errors; `GeneralContractor` appears only when real phone + address are set.
- [ ] Typecheck, lint and build pass.

## Checks to run

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`, confirming `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `icon`, `apple-icon` and `opengraph-image` appear as static routes

## Manual test steps (after implementation)

1. `npm run build && npm run start`, then open:
   - http://localhost:3000/robots.txt (expect `Disallow: /` locally since `VERCEL_ENV` isn't production; run `VERCEL_ENV=production npm run build && npm run start` to see the production version)
   - http://localhost:3000/sitemap.xml
   - http://localhost:3000/manifest.webmanifest
   - http://localhost:3000/opengraph-image
2. View source on `/`: check title, description, canonical, OG/Twitter tags, `theme-color`, JSON-LD.
3. Copy the JSON-LD into https://validator.schema.org/ and expect 0 errors.
4. Set `GOOGLE_SITE_VERIFICATION=test123` in `.env.local`, restart, and confirm `<meta name="google-site-verification" content="test123">`; remove it after.

## Go-live steps for Search Console (also written to `docs/search-console.md`)

1. In Vercel: add `swapnobari.in` + `www.swapnobari.in`, set apex as primary (www redirects to apex). Set `NEXT_PUBLIC_SITE_URL=https://swapnobari.in` for Production.
2. In Search Console: add a **Domain property** `swapnobari.in`, copy the TXT record, and add it in Cloudflare DNS. Verify. (Fallback: URL-prefix property + `GOOGLE_SITE_VERIFICATION` env var + redeploy.)
3. Submit `https://swapnobari.in/sitemap.xml` under Sitemaps.
4. URL Inspection on `https://swapnobari.in/` → Request indexing.
5. Run https://search.google.com/test/rich-results on the homepage.
6. After launch: watch Pages (indexing) and Core Web Vitals reports, and resubmit the sitemap when new pages go live.
7. Create a **Google Business Profile** for the Silchar office (biggest local-search win; needs the real address and phone).

## Needs the user's input

- Approve the default title and description copy above.
- Real phone, address and PIN (enables the `GeneralContractor` business markup) and social profile URLs (for `sameAs`), when the client provides them.
- Whether to show a `priceRange` (e.g. "₹₹") in business markup.
