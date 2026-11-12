# Home polish, sellers and banner placement

## Goal

Make the home page look finished and professional, show the admin's approved dealers on Home and on a live Building Materials page, and place the banner inside the sellers section.

## Read

- `AGENTS.md` §4, §6, §7, §11, §12, §14, §15
- `PRD.md` §5, §7.1, §7.2, §9
- `DESIGN.md` §7.1, §7.3–7.5, §8.2, §8.5, §9
- Admin `prompts/dealers.md`, `prompts/ads.md`; dealer and ad migrations; `components/ads/ad-form.tsx`
- Local Next.js docs before coding: `searchParams` in `page`, `use cache`, Suspense under Cache Components
- User's screenshots of Home and the admin Dealers list

## Existing code inspected

- `prompts/home-page.md` and everything it built
- `lib/data/ads.ts`, `components/ads/*`, `lib/stores/ad-store.ts`, `app/api/track/ad/route.ts`
- `components/home/*`, `lib/content/home.ts`, `components/estimator/*` (card style to match)
- Public grants: `dealers` exposes `id, slug, business_name, city_id, area_id, address, pin, description, photo_path, is_verified, placement, placement_starts_on, placement_ends_on`. Phones are not public.
- Live data: one banner, in `home_banner`. In admin a banner's slot is locked once created.

## Decisions and assumptions

1. **Dealer contact goes through Swapnobari (user decision, answers AGENTS §14 Q1 for now).** Cards have one button, **Get Price**, opening WhatsApp to Swapnobari with the dealer's name filled in. No Call button, no dealer number public, no migration.
2. **Each Get Price click is logged** in `dealer_contact_events` as `whatsapp`, so the admin's dealer counts start working.
3. **Banner moves into the sellers section (user decision).** The side column shows `home_materials_side`. If that slot has no live banner it falls back to `home_banner`, so the Locallify banner appears without re-uploading it. The standalone banner section is removed.
4. **"Appeared randomly" is read as position.** Only one banner is live, so nothing rotates.
5. **Service cards become wider and colourful (user request).** A 3 × 2 grid replaces six narrow columns, so every button fits on one line. Each card keeps its icon panel, shorter than now, tinted in its own colour from the DESIGN §3.3 step palette plus `navy-500`. Colour stays in the panel and icon: buttons remain navy outline, and the green step colour is not used, so green still means WhatsApp only. This departs from DESIGN §8.2 and §7.3 on purpose; photos can replace the panels when they arrive (AGENTS §14 Q10).
5a. **Every enabled material gets its own card (user request).** Cards replace the chips and come from `material_categories`, so a category enabled in admin appears by itself and a disabled one (Sand & Stone, Tiles, Electrical, Plumbing today) stays hidden, as AGENTS §4 requires.
6. **Building Materials goes live** with search, because "View All Sellers" needs a destination. It joins the menu, and the temporary Today's Price menu item moves to a link on that page and in the footer.
7. **Building Materials omits the `materials_top` banner for now.** A large banner above the search would repeat the problem just reported. The side rail keeps `materials_side`.
8. **No-results and Get Price stay on WhatsApp in this slice.** The lead forms (PRD §7.2, AGENTS §4 no-results lead) are the next slice. The no-results wording is exact.
9. **No dealer profile page yet.** Cards don't link anywhere except Get Price.
10. Sponsored and Featured count only inside their date range, checked in Indian time. Sponsored first, then Featured, then by name. Sponsored always shows the "Sponsored" label.

## Files

Create:

- `lib/data/dealers.ts` (`getPublicDealers`, `getSearchOptions`, `isDealerApproved`, `recordDealerContact`)
- `lib/domain/dealers.ts` (pure: live placement, ordering, search filter) and `lib/domain/dealers.test.ts`
- `lib/validation/dealer-search.ts`, additions to `lib/validation/tracking.ts`
- `app/api/track/dealer/route.ts`
- `app/(site)/building-materials/page.tsx`
- `components/dealers/dealer-card.tsx`, `dealer-get-price.tsx` (client: logs, then opens WhatsApp), `dealer-search-form.tsx`, `dealer-results.tsx`
- `components/home/material-card.tsx`
- `components/home/section-heading.tsx`

Modify:

- `app/(site)/page.tsx`, `components/ads/ad-banner.tsx`
- `components/home/materials-section.tsx`, `services-section.tsx`, `quick-flow.tsx`, `how-it-works.tsx`, `sanskar-band.tsx`, `cta-band.tsx`
- `components/site/site-footer.tsx`, `mobile-nav.tsx` (icon only if needed)
- `lib/content/home.ts`, `lib/data/materials.ts` (slug and brand count), `lib/site-config.ts`, `lib/seo.ts` (`/building-materials` live), `lib/whatsapp.ts` (`dealerEnquiry`), `lib/constants.ts`, `app/globals.css`

## Implementation

**Home order:** Hero → Quick links → Our Services → Find Building Materials → How It Works → Sanskar → CTA → Footer.

**Find Building Materials (Home):**

- Left about 75%: heading, one card per enabled material, the search form (material, city, optional brand) that goes to `/building-materials`, then "Featured Sellers" with up to 4 dealer cards and "View All Sellers →".
- Material card: its admin icon in a tinted tile, name, number of active brands ("1 brand", or "Brands coming soon"), and an arrow. The whole card links to `/building-materials?material=<slug>`. Three across on desktop, two on phones; extra categories wrap to the next row. Tints cycle through the same palette as the service cards.
- Right about 25%: the banner at 16:9 in the column, with its label. Below the sellers on mobile.
- Below both: a full-width outline link, "Check Today's Cement & TMT Price →".
- No approved dealers: "Sellers are being added. Tell us what you need and we'll arrange a quote." with a WhatsApp button.

**Dealer card (DESIGN §7.3):** 1:1 photo or an initial tile, business name, pin icon with area and city, "Brands:" line, materials, badges top-right (Verified blue, Featured navy, Sponsored grey with label), full-width orange Get Price. Dealer images use `next/image` from `public-images`.

**Building Materials page:**

- Compact page hero and the search panel.
- GET form, state in the URL (`?material=&city=&brand=`), validated with Zod; invalid values are ignored.
- Results filter by service area's city (or the dealer's own city), material and brand. Two columns on desktop, one on mobile; `materials_side` banner in the right rail, below results on mobile.
- No results: "No sellers listed here yet. Tell us what you need and we'll arrange a quote," with a WhatsApp button.
- Links to Today's Price. `searchParams` is read inside `<Suspense>`; the dealer list itself is cached.

**Tracking:** `POST /api/track/dealer` takes `{ dealerId, categoryId? }`, validates with Zod, confirms the dealer is approved, inserts with the secret key, returns 204. Uses `navigator.sendBeacon`. No IP stored.

**Polish, across Home:**

- One shared section heading: small orange uppercase eyebrow, H2 at `text-[28px] sm:text-[36px]`, subtitle in `gray-600`, matching the estimator card's "FREE ESTIMATE" style.
- Quick links: one contained bar of five equal icon-and-label items, not loose pills. Horizontal scroll on phones.
- Services: 3 × 2 from 1024 px, 2 columns at 768 px, carousel on phones. Coloured icon panel, title, line and a one-line navy outline button; the card lifts on hover.
- Add the step palette as `--color-step-*` tokens in `app/globals.css` and use them in the service cards, material cards and How It Works, so no hex values sit in components.
- How It Works: steps sit on a white card with one connecting line, not floating text.
- Sanskar: confirm the Playfair title renders in `next dev` too (the user's screenshot shows a sans title); white icon circles with a marigold ring.
- Consistent section padding and a clean light-grey / white rhythm.

## Data and RLS

No migrations. Reads use existing `anon` grants and policies, including `brands`, `cities`, `areas` and the dealer join tables. `dealer_contact_events` is inserted with the existing `service_role` grant.

## Security

- No dealer phone, owner name or admin note is read or sent to the browser.
- Search parameters and beacon bodies are validated with Zod on the server.
- Secret key only in `lib/data/dealers.ts` and `lib/data/ads.ts`.
- `dealers` cache tag is already in `PUBLIC_CACHE_TAGS`, so admin edits refresh the site.

## UI

- **Visual interpretation:** DESIGN §8.2 item 5 and §8.5, except decisions 5 and 7.
- **Layout:** the 1440 container on every section.
- **Typography:** Inter; Fraunces in the hero only; Playfair for the Sanskar title and quote only.
- **Spacing:** `py-16 lg:py-24` between sections, `gap-5` in grids.
- **Colours:** orange for Search and Get Price; navy for structure; green only for WhatsApp-labelled buttons; `sanskar-*` in that band.
- **States:** hover and focus per §7.1; empty dealers; no results; missing dealer photo; load failure shows the user-safe message.
- **Mobile at 360 px:** no sideways page scroll, tap targets at least 44 px, cards stacked, banner below sellers.

## Acceptance criteria

- [ ] Approved dealers appear on Home and on `/building-materials`; the pending dealer does not
- [ ] Sponsored dealers come first and show "Sponsored"; an expired placement doesn't count
- [ ] Each enabled material has its own card linking to its filtered sellers; enabling or disabling one in admin adds or removes its card
- [ ] Service cards are colourful, wider, and every button stays on one line at 1024 and 1440 px
- [ ] Search by material, city and brand works and is shareable by URL
- [ ] No results shows the exact wording
- [ ] Get Price opens WhatsApp with the dealer's name and adds a row to `dealer_contact_events`
- [ ] No dealer number appears in the page HTML
- [ ] The banner shows only in the sellers section, with its label; no standalone banner section
- [ ] Editing a dealer in admin updates the site
- [ ] Sanskar title is serif in dev and production
- [ ] No sideways scroll at 360, 768 or 1440 px

## Checks

`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`.

## Manual test

1. `npm run dev`, open `/` and scroll at desktop and phone widths.
2. Confirm Locallify shows as a seller and the banner sits beside the sellers.
3. Click Get Price; confirm the WhatsApp message and that the dealer's count rises in admin.
4. Open Building Materials; search with matching and non-matching filters.
5. In admin, unapprove or edit a dealer; refresh the site.
