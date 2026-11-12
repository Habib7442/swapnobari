# Home: "Find Building Materials Near You" polish

## Goal

Make the homepage materials section look finished: honest seller counts on category tiles, a properly aligned 75/25 layout with a sticky ad, a seller grid with no empty gaps, a real price banner card, and no dead space at the bottom.

## Read

- `AGENTS.md` (all), especially §4, §6, §12, §14
- `DESIGN.md` §3.4, §4, §5, §7.1, §7.3 (dealer card), §7.4, §7.5, §8.2 item 5, §9, §10
- `prompts/home-polish-dealers.md` (the previous slice that built this section)
- No new Next.js APIs are used. The existing `"use cache"` data functions are reused unchanged.

## Existing code inspected

- `components/home/materials-section.tsx`, `components/home/material-card.tsx`
- `components/dealers/dealer-card.tsx`, `dealer-search-form.tsx`, `dealer-results.tsx`, `dealer-get-price.tsx`
- `components/ads/ad-banner.tsx`, `ad-banner-client.tsx`
- `components/site/section.tsx`, `section-header.tsx`, `components/home/services-section.tsx`
- `lib/data/materials.ts`, `lib/data/dealers.ts`, `lib/data/prices.ts`, `lib/domain/dealers.ts`
- `components/prices/price-list.tsx` (`formatPriceDate`), `app/(site)/todays-price/page.tsx`
- `lib/seo.ts` (`/list-your-store` is `live: false`, so the page does not exist yet)
- `lib/whatsapp.ts`, `app/globals.css` (no status tokens yet; the admin twin has them)

## Decisions and assumptions

1. **Seller count = approved dealers that sell the category, in any city.** Computed from the already-cached `getPublicDealers()` by a new pure function `countDealersByMaterial`. No new query and no migration. Brand count is no longer shown.
2. **"Featured Sellers" keeps today's selection:** approved dealers, Sponsored → Featured → rest (existing `sortDealers`). It shows **up to 3** (one row at lg) instead of 4, because the grid is now 3 columns.
3. **Grid deviation from DESIGN §8.2/§10:** 1 col mobile, 2 at md, 3 at lg, instead of 4 across. The left column is only ~75% wide, so 4 cards would be cramped. Deliberate; noted here as the user asked.
4. **Gap filling with the "List your store" card**, never fake sellers. The card spans whatever is left of the last row, so there is never an empty slot:

   | Sellers shown | Mobile | md (2 cols) | lg (3 cols) |
   |---|---|---|---|
   | 0 | empty panel, then card | panel spans 2, card spans 2 | panel spans 2, card spans 1 |
   | 1 | card shown | card spans 1 | card spans 2 |
   | 2 | card shown | card spans 2 | card spans 1 |
   | 3 | hidden | card spans 1 | hidden |

5. **`/list-your-store` is not built yet.** The card's button links to `/list-your-store` when that route is `live` in `lib/seo.ts`; until then it opens WhatsApp to Swapnobari with a new `listStore` template ("Hi Swapnobari, I sell building materials and would like to list my store on your website."). It switches automatically once the page goes live. The button stays the navy Secondary style (it is not a WhatsApp-branded button, so it is not green).
6. **Zero sellers** shows the exact AGENTS §4 text "No sellers listed here yet. Tell us what you need and we'll arrange a quote." with the existing green WhatsApp CTA (`materials` template). Lead forms are not built yet, so the "material lead" goes through WhatsApp, as in the previous slice.
7. **Icon tiles:** navy-50 background, navy-700 icon for every category, as requested. (The services cards currently still use the coloured `CARD_TINTS`; they are out of scope and not changed.)
8. **"Coming soon" pill** uses DESIGN §3.4 Neutral. Add `--color-status-neutral` / `--color-status-neutral-bg` to `app/globals.css` `@theme`, the same names and values already in the admin twin.
9. **Coming-soon tiles** are a plain `<div aria-disabled="true">`, not focusable, not a link; muted icon tile (gray-50 bg, gray-500 icon) and gray name, but the same size, border and radius as live tiles so they look intentional.
10. **Layout uses one CSS grid** so desktop and mobile order differ without duplicate markup. DOM order: main column, ad, price banner.
    - lg: `grid-cols-[minmax(0,3fr)_minmax(0,1fr)]`; main = col 1 row 1; price banner = col 1 row 2; ad aside = col 2 rows 1–2 with `sticky top-24` inside. Tops of both columns align at row 1.
    - below lg: one column: tiles → search → sellers → ad → price banner (ad after results, DESIGN §9).
11. **Empty ad placeholder** becomes `aspect-video` (same size as a live banner) instead of `h-28`. This is in the shared `AdBanner`, so the Building Materials side rail gets the same fix. Label, tracking and the paused-slot behaviour are untouched.
12. **Price banner date:** newest `updatedAt` from `getPublicPrices()`, formatted with the existing `formatPriceDate`. Hidden when there are no rows or the read failed. No price figures are shown on the banner.
13. **Search row** already matches the spec (labels above, 48 px fields and button, bottom-aligned, stacked full-width on mobile). No change, so the Building Materials page is unaffected.
14. Dealer card is unchanged (Get Price only; Call/WhatsApp-on-card is AGENTS §14 #1).

## Files

Modify:

- `components/home/materials-section.tsx`: new layout, tiles row, seller grid with gap card, price banner
- `components/home/material-card.tsx`: navy tile, seller count / Coming soon pill, link vs muted
- `components/ads/ad-banner.tsx`: empty placeholder `aspect-video`
- `lib/domain/dealers.ts`: `countDealersByMaterial()`
- `lib/domain/dealers.test.ts`: tests for it
- `lib/whatsapp.ts`: `listStore` template
- `app/globals.css`: two status-neutral tokens

Create:

- `components/home/list-store-card.tsx` (the dashed "List your store" card)
- `components/home/price-banner.tsx` (the Today's Price card)

No new dependencies. No data, RLS or migration changes.

## Implementation

**Category tiles (`MaterialCard`)**
- Props: `material`, `sellerCount`.
- Tile: `rounded-xl border border-gray-200 bg-white p-4`, min-h 76 px, icon tile `size-12 rounded-xl`, icon `size-6`, stroke 1.75.
- `sellerCount > 0`: `<Link href="/building-materials?material=<slug>">`, icon tile `bg-navy-50 text-navy-700`, name navy-700 600, helper "1 seller" / "N sellers" in gray-500 13 px, arrow icon at sm+, `shadow-brand-sm`, hover `shadow-brand-md`, focus ring (orange outline as elsewhere).
- `sellerCount === 0`: `<div aria-disabled="true">`, icon tile `bg-gray-50 text-gray-500`, name gray-600, helper is a pill `bg-status-neutral-bg text-status-neutral`, 12 px, 500, h-6, "Coming soon". No shadow, no arrow.
- List: below md a horizontal scroller (`flex snap-x overflow-x-auto`, tiles `w-[220px] shrink-0 snap-start`, hidden scrollbar, `-mx-5 px-5` bleed like services) with a right-edge fade (`mask-image` linear gradient, removed at md). md+: `grid grid-cols-3 gap-4`. Order = admin order from `getEnabledMaterials()`.

**Search row**: existing `DealerSearchForm`, 20 px below tiles.

**Featured Sellers**: heading row ("Featured Sellers" + "View All Sellers →", unchanged) 40 px below search; grid `grid gap-4 md:grid-cols-2 lg:grid-cols-3`; cards and gap card per the table in decision 4. Span classes come from a small constant map keyed by count, so all class names are static for Tailwind.

**List store card**: `flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center`, full height of the row. `Store` icon in a navy-50 tile (size-12), title "Sell cement or TMT in Silchar?" (600, navy-700), line "Get a free listing and enquiries on WhatsApp." (gray-500, 14 px), Secondary button "List Your Store" + `ArrowRight` (h-11, white, 1 px navy-700 border, navy text, hover navy-50, focus ring). WhatsApp href opens in a new tab with `rel="noopener noreferrer"`; the internal link does not.

**Zero sellers panel**: existing gray-50 panel with the AGENTS §4 text (or `GENERIC_ERROR` if the dealer read failed, as on Building Materials), plus the existing WhatsApp button. `aria-live` not needed (server-rendered, not a search result).

**Ad aside**: `<aside aria-label="Advertisement">` with `lg:sticky lg:top-24`; below lg it is full width, `max-w-md mx-auto`, as now. `AdBanner slotKey="home_materials_side" fallbackSlotKey="home_banner"` unchanged.

**Price banner (`PriceBanner`)**: a server component taking `latest: string | null`.
- `rounded-2xl bg-navy-50 p-5 md:p-6`, `flex flex-col gap-4 md:flex-row md:items-center`.
- Left: white icon tile `size-12 rounded-xl`, Lucide `IndianRupee` navy-700.
- Middle (`flex-1 min-w-0`): title "Today's Cement & TMT Price" as an `h3` (18 px, 600, navy-700); line "Indicative prices. Actual price may vary by dealer and quantity." (14 px, gray-600); when `latest`: "Last updated {date}" (13 px, gray-500).
- Right: ghost `Link` to `/todays-price`, "Check prices" + `ArrowRight`, navy-700 600, underline on hover, min-h-11. Mobile: `w-full justify-center rounded-[10px] bg-white`; md: auto width, transparent background. No orange.

**Spacing**: price banner 40 px below the sellers on desktop (row gap), 32 px stack gap on mobile; nothing after it except the Section's bottom padding, so the old trailing full-width bar and its extra gap are gone.

## Security

No new inputs, routes or data access. Public reads only through the existing cached RLS-limited functions. No dealer phone numbers exposed. External links keep `noopener`; ad links keep `rel="sponsored noopener"`.

## Acceptance criteria

- [ ] Tiles show "N sellers" for categories with approved dealers and a neutral "Coming soon" pill otherwise; never "brands".
- [ ] Only seller tiles are links (pre-select the material on `/building-materials`); coming-soon tiles are not focusable and carry `aria-disabled`.
- [ ] All icon tiles navy-50 / navy-700 (muted gray only for coming soon).
- [ ] Mobile tiles scroll horizontally with snap and a right fade; no wrapping, no page scroll.
- [ ] Desktop: left column ~75%, ad ~25%, tops aligned, ad sticks at `top-24` while the left column scrolls.
- [ ] Below lg: ad appears after the seller cards, before the price banner.
- [ ] Seller grid 1 / 2 / 3 columns with no empty slot at any width, per decision 4; never a fake seller.
- [ ] Zero sellers: exact AGENTS §4 message + WhatsApp CTA + List-your-store card.
- [ ] Sponsored badge still shown on sponsored dealers.
- [ ] Price banner: navy-50, 16 px radius, icon tile, title, indicative line, last-updated date only when prices exist, ghost "Check prices →"; stacked on mobile with a full-width 44 px link.
- [ ] Empty ad slot shows "Advertise here: contact us" at 16:9, same size as a live banner; "Advertisement" label and impression/click tracking unchanged.
- [ ] Tokens only, Lucide only, visible focus rings, ≥ 44 px targets.
- [ ] No clipped text or horizontal page scroll at 360, 768, 1024, 1280, 1440.

## Checks

- `npx tsc --noEmit`
- `npm run lint`
- `npx vitest run lib/domain/dealers.test.ts`
- `npm run build`

## Manual test

1. `npm run dev`, open `/`, scroll to "Find Building Materials Near You".
2. At 1440 and 1280: tiles in 3 columns, ad on the right with its top level with the first tile row; scroll and confirm the ad stays pinned until the section ends. Price banner sits under the sellers in the left column.
3. A tile with sellers reads "N sellers" and links to `/building-materials?material=<slug>` with that material pre-selected. A tile without sellers shows "Coming soon", has no pointer, and Tab skips it.
4. Count seller cards: confirm the dashed "List your store" card fills the rest of the row and nothing else is blank. In admin, unapprove a dealer (or temporarily filter) to see the 0 / 1 / 2 / 3 cases.
5. Click "List Your Store": it opens WhatsApp with the listing message (page not live yet).
6. Price banner shows "Last updated <date>" matching the newest row on `/todays-price`; "Check prices →" goes to `/todays-price`.
7. Pause the `home_materials_side` banner's dates in admin (or with no live banner in either slot): the grey "Advertise here: contact us" box is 16:9. With a live banner, the "Advertisement" label shows, and the network tab shows `/api/track/ad` impression and click beacons.
8. At 1024: same 75/25 layout, sellers 3 columns.
9. At 768: one column, tiles 3 across, sellers 2 columns, ad after sellers (max 448 px wide, centred), then the price banner side-by-side layout.
10. At 360: tiles scroll sideways with a right fade, search stacked with a full-width orange button, sellers stacked, ad, then price banner stacked with a full-width "Check prices" link. No horizontal page scroll.
11. Keyboard: Tab through tiles, search, cards, list-store button, price link; every stop has a visible focus ring.
