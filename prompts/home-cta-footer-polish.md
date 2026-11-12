# Home CTA band + site footer polish

## Goal

Give the homepage CTA band a clear primary action (estimate) beside WhatsApp, and rebuild the site footer into a compact, data-driven five-column footer that shows only real contact details; plus a Sanskar header width fix.

## Read

- `AGENTS.md` §4, §6, §11, §14, §15
- `DESIGN.md` §7.1, §8.2 items 9–10, §10, §11
- Next.js docs: `02-guides/migrating-to-cache-components.md` (synchronous `new Date()` fails the prerender; run it inside `"use cache"` or at request time), `04-functions/cacheLife.md`

## Existing code inspected

- `components/home/cta-band.tsx` (navy-900, bare `House` icon, one green WhatsApp button)
- `components/site/site-footer.tsx` (4 columns, hardcoded "© 2026", legal links filtered by `live`), `app/(site)/layout.tsx`, `components/site/floating-whatsapp.tsx` (desktop only, `bottom-6`, 56 px)
- `lib/site-config.ts`: `phone` is a placeholder (`hasPhone` = false), no email, address = locality + region only, `social: []`
- `lib/seo.ts`: live routes are `/`, `/construction-budget`, `/building-materials`, `/todays-price`; `/privacy`, `/terms`, `/contact`, `/about`, `/projects` are **not live**
- Admin migrations: `site_settings` is key/value with `is_public`; **no contact, email or social keys exist yet** (only estimate settings)
- `lib/data/materials.ts` (`getEnabledMaterials`, cached), `lib/content/home.ts` (`HOME_SERVICES`)
- `components/home/hero.tsx` + `components/estimator/estimator-card.tsx` (form has `id="budget"`, hidden below md)
- `components/home/sanskar-band.tsx`

## Decisions and assumptions

1. **Contact data source.** `site_settings` has no contact/social keys yet, so the footer uses what exists today: WhatsApp from `WHATSAPP_NUMBER` (existing `getWhatsAppNumber()` prop) via `whatsappUrl`, phone only if `hasPhone`, email only if `siteConfig` gains one (it has none), city line "Silchar, Assam" from `siteConfig.address` (the service area, not an invented address; street/PIN render only if filled). Today this renders two rows: WhatsApp and the city. When the admin Site Settings module adds keys, the footer switches to them.
2. **Social icons**: rendered only if `siteConfig.social` has URLs (the current single source, also used for JSON-LD `sameAs`). It is empty, so nothing renders. Icons are Lucide (`Facebook`, `Instagram`, `Youtube`) chosen by URL host; unknown hosts get `Globe`.
3. **"Get Free Estimate" target.** The hero form (`#budget`) exists only at md+; on mobile it is intentionally hidden. So: md+ → `/#budget` (scrolls to the hero form); below md → `/construction-budget` (the form's own page). Two links, each shown at its breakpoint, same label.
4. **Copyright year without breaking the prerender**: a tiny `"use cache"` function `currentYear()` with `cacheLife("days")` in `lib/data/site.ts` (server-only), since `new Date()` outside a cache scope fails the build under `cacheComponents`. The year is the Indian calendar year.
5. **Legal links**: Privacy and Terms are not live, so the bottom row shows only "© {year} Swapnobari"; the existing `live` filter keeps them out until the pages ship. Listed in Needs your attention.
6. **Quick Links**: Home, the live main-nav items, Today's Price (as now). Hidden routes never appear.
7. **Services column** keeps linking each service to `/#services` (no service pages exist yet).
8. **Building Materials column**: every enabled category in admin order → `/building-materials?material=<slug>`; plus nothing else. If the read fails or is empty, the column is omitted.
9. **Mobile height** is reduced by: Quick Links + Building Materials side by side; Services links in two columns inside its full-width block; smaller gaps (32 px between blocks instead of 40). Links stay ≥ 44 px tall on mobile (DESIGN §11), 32 px at md+.
10. **Link colour**: gray-500 per the brief (5.0:1 on white, passes).
11. **Floating WhatsApp clearance**: the button is desktop-only, 56 px at `bottom-6` (80 px total). The bottom row gets `md:pb-24` so the last line is never under it; mobile keeps normal padding (no floating button there).
12. **Sanskar fix**: the header row moves out of the image-offset wrapper, so it spans the full container; stages and CTA keep the `lg:pl-[16%]` offset. The quote keeps `max-w-md`. Nothing else changes. (The header now sits above the image's top area, which is plain cream in the supplied photo.)

## Files

Modify:

- `components/home/cta-band.tsx`
- `components/site/site-footer.tsx` (becomes an async server component)
- `components/home/sanskar-band.tsx` (header placement only)

Create:

- `lib/data/site.ts` (`currentYear()`)

No new dependencies. No data, RLS or migration changes.

## Implementation

**CTA band**

- Layout: `flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left`.
- Left: `flex flex-col items-center gap-4 md:flex-row md:items-start`; icon tile `size-12 rounded-full bg-white/10` with `House` `size-6` white `strokeWidth={1.75}`, `aria-hidden`; title and line unchanged.
- Buttons: `flex w-full flex-col gap-3 sm:w-auto sm:flex-row`, orange first. Both `h-12 rounded-[10px] px-6 font-semibold`, full width on mobile.
  - Orange "Get Free Estimate" + `ArrowRight`: `bg-orange-500 hover:bg-orange-600 text-white`, focus outline white. Two `Link`s per decision 3 (`md:hidden` / `hidden md:inline-flex`).
  - Green "Enquire Now on WhatsApp" unchanged (icon, label, arrow, `enquiry` template).

**Footer**

- `<footer className="border-t border-gray-200 bg-white">`, container classes as the site.
- Grid: `grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-3 md:gap-10 md:py-12 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.2fr]`.
  - Brand `col-span-2 md:col-span-3 lg:col-span-1`: `Logo`, one line (existing copy), social icons if any (44 px round targets, `aria-label` = network name).
  - `<nav aria-label="Quick links">` (col 1 mobile).
  - `<nav aria-label="Building materials">` (col 2 mobile; DOM order after Quick Links so they sit side by side).
  - `<nav aria-label="Services">` `col-span-2 md:col-span-1`, list `grid grid-cols-2 gap-x-6 md:grid-cols-1`.
  - Contact `col-span-2 md:col-span-1`: `<address className="not-italic">` with only existing rows (WhatsApp link with `WhatsAppIcon` green, phone `Phone` if `hasPhone`, location `MapPin`).
  - Desktop visual order: brand | Quick Links | Services | Building Materials | Contact via `lg:order-*`.
- Headings `h2 text-sm font-semibold text-navy-700`; links `text-sm text-gray-500 hover:text-navy-700 hover:underline min-h-11 md:min-h-8 inline-flex items-center`, focus outline orange-500.
- Bottom row: `border-t border-gray-200`, `flex flex-col items-center gap-2 py-4 text-center text-sm text-gray-500 md:flex-row md:justify-between md:pb-24 md:text-left`: "© {year} Swapnobari"; legal list (live only) joined with "·".
- `SiteFooter` reads `getEnabledMaterials()` and `currentYear()` (both cached), so the layout stays prerenderable.

**Sanskar**: render the header block before the `lg:pl-[16%]` wrapper; the `<ol>` and CTA stay inside it.

## Security

No inputs or new routes. Only public cached reads (enabled categories). No contact data invented; external links `rel="noopener noreferrer"`.

## Acceptance criteria

- [ ] CTA: icon in a 48 px white/10 circle; orange "Get Free Estimate" then green WhatsApp, both 48 px; mobile stacked, centred, full-width buttons, orange first.
- [ ] Get Free Estimate goes to `/#budget` at md+ and `/construction-budget` below md.
- [ ] Footer: white, gray-200 top border, `<footer>` + labelled `<nav>`s; five columns at lg in the order brand | Quick Links | Services | Building Materials | Contact.
- [ ] Building Materials lists enabled categories in admin order, each pre-filtering the search.
- [ ] Contact shows only existing values (today: WhatsApp + Silchar, Assam); no phone/email/social placeholders.
- [ ] Bottom row "© {current year} Swapnobari"; no link to a non-live page.
- [ ] Mobile: brand; Quick Links | Building Materials side by side; Services full width (two-column list); Contact; bottom row centred. Visibly shorter than before; links ≥ 44 px tall.
- [ ] Floating WhatsApp never covers the bottom row at md+.
- [ ] Sanskar header spans the full content width; subtitle on one line at 1280 and 1440; stages and CTA unchanged.
- [ ] Tokens only, Lucide only, visible focus rings; no horizontal scroll at 360, 768, 1024, 1280, 1440.

## Checks

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (layout now reads cached data; `/` must stay prerendered)

## Manual test

1. `npm run dev`, open `/`.
2. CTA at 1280: icon in a soft circle; "Get Free Estimate" scrolls to the hero form; WhatsApp opens with the enquiry message.
3. CTA at 360: centred, buttons stacked full width, orange first; Get Free Estimate opens `/construction-budget`.
4. Footer at 1440/1280/1024: five columns in order; materials links open `/building-materials?material=…` pre-selected; contact shows WhatsApp + Silchar, Assam only; "© 2026 Swapnobari"; floating WhatsApp clear of the bottom line.
5. Footer at 768: three columns, no overlap.
6. Footer at 360: brand, then Quick Links and Building Materials side by side, Services in two columns, Contact, centred bottom row; compare height with before.
7. Sanskar at 1280 and 1440: subtitle on one line; stages unchanged.
