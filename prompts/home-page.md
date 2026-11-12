# Home page and Today's Price (first client preview)

## Goal

Turn the home page from a hero alone into a complete-looking page, and publish Today's Cement & TMT Price, so the client can see the public site and watch their admin edits (prices, ads, materials) appear on it.

## Read

- `AGENTS.md` §3, §4, §6, §7, §11, §14, §15
- `PRD.md` §4, §5, §6.2, §7.1, §7.3, §8.1, §9
- `DESIGN.md` §3, §7.1, §7.3–7.6, §7.9, §8.1, §8.2, §8.6, §9
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache*.md`; re-read the `next/image` and font guides before coding those parts
- Admin `prompts/dealers.md`, `prices.md`, `ads.md`; migrations for dealers, prices and ads

## Existing code inspected

- `app/(site)/page.tsx` renders only `Hero`. `app/(site)/layout.tsx` has a header and no footer.
- `components/home/how-it-works.tsx` and `materials-section.tsx` exist but nothing uses them.
- `lib/seo.ts`: only `/` and `/construction-budget` are live. `lib/site-config.ts`: the nav points at 4 pages that 404, and the phone is a placeholder.
- `lib/data/estimator.ts`: the pattern for `"use cache"` public reads.
- Production has 3 material categories and 1 brand, dealer, price and ad readable by the public. These look like test rows.

## Decisions and assumptions

1. **No dealer cards or seller search in this slice.** Dealer phones are not public until open question 1 is answered.
2. **No Projects or Client Feedback sections.** Those admin modules don't exist and testimonials must not be invented. They slot in later, after Sanskar.
3. **Nothing links to a page that 404s.** The nav lists only live routes (driven by `live` in `publicRoutes`), so new pages appear by themselves. Today's Price sits in the nav until Building Materials ships. The nav shrinks for now, and "More" is hidden when it would be empty.
4. **Service, Sanskar and "Find sellers" actions open WhatsApp with a pre-filled message** until the enquiry forms and pages exist. These create no lead yet. Budget Estimate goes to `/construction-budget`, which does.
5. **Services and Sanskar stages are interim code content** in `lib/content/home.ts`, marked for replacement when admin modules 5 and 14 ship. Wording comes from the PRD; I write only the one-line service descriptions.
6. **Service cards use a tinted icon panel in the 16:10 image area**, because no service photos exist (AGENTS §14 Q10).
7. **`home_banner` is capped at 880 px wide and centred on desktop.** Full-width 16:9 in the 1440 container would be about 760 px tall. Mobile is full container width.
8. **The home banner ignores city targeting.** The page doesn't know the visitor's city.
9. **Mobile has no floating WhatsApp button and no sticky bar.** Desktop gets the floating button (DESIGN §7.9). The client rejected the mobile bar, so that part of §7.9 is ignored.
10. **The footer shows no placeholder contact details.** Phone, email and address are left out until real values exist. The mobile drawer's Call button is hidden while the phone is the placeholder.
11. **Sanskar band title uses Playfair Display 600**, as AGENTS §6 allows and DESIGN §8.6 asks. Its button reads "Ask About Shubh Nirman Sanskar", since there is no page to "Explore" yet.
12. **Zustand is the client state store (user decision).** New dependency: `npm install zustand`. It holds shared browser-only UI state and never server data, leads or anything secret. No `persist` middleware, because AGENTS §8 rules out `localStorage` as app storage. Stores are written only in effects and event handlers, so the module-level store is never changed during server rendering and can't leak between requests.

## Files

Create:

- `components/home/quick-flow.tsx`, `services-section.tsx`, `sanskar-band.tsx`, `cta-band.tsx`
- `components/ads/ad-banner.tsx` (server wrapper, empty placeholder), `components/ads/ad-banner-client.tsx` (rotation, tracking)
- `components/site/site-footer.tsx`, `components/site/floating-whatsapp.tsx`
- `lib/content/home.ts`, `lib/data/ads.ts`, `lib/data/prices.ts`, `lib/data/materials.ts`
- `lib/validation/tracking.ts`
- `lib/stores/ad-store.ts`
- `app/api/track/ad/route.ts`
- `app/(site)/todays-price/page.tsx`
- `components/prices/price-list.tsx`

Modify:

- `app/(site)/page.tsx`, `app/(site)/layout.tsx`, `app/layout.tsx` (Playfair variable)
- `app/globals.css` (`--font-sanskar`)
- `components/home/hero.tsx` (the `/build-your-home` link becomes `#services`)
- `components/home/how-it-works.tsx`, `materials-section.tsx` (1440 container; live data; no dead links)
- `components/site/nav-links.tsx`, `mobile-nav.tsx`, `lib/site-config.ts`
- `lib/seo.ts` (`/todays-price` live), `lib/whatsapp.ts` (new templates)
- `next.config.ts` (allow the `public-images` host only if it isn't already allowed)
- `package.json` and the lockfile (`zustand`)

## Implementation

**Home order:** Hero (unchanged apart from the link) → Quick flow → Our Services (`id="services"`) → `home_banner` → Find Building Materials → How It Works → Sanskar band → CTA band → Footer.

**Quick flow:** five pills per DESIGN §8.2. Build a House → `#services`; Know Construction Cost → `/construction-budget`; Plan My House and Vastu Alignment → WhatsApp; Find Cement/TMT Seller → `#materials`.

**Services:** six cards from PRD §6.2 with its button labels, secondary style. Six across at 1280 px and up, 3 × 2 at 1024, 2 × 3 at 768, swipe carousel with peek on mobile.

**Materials section:** chips from enabled `material_categories` with their icons (cached, tag `materials`). "Find sellers" opens WhatsApp using the `materials` template with `area` = `siteConfig.address.locality`, because an empty `area` produces an empty message. "Check today's price" goes to `/todays-price`.

**Ad banner:**

- Read live ads by slot key (cached, tag `ads`, `cacheLife("minutes")`). RLS applies the dates and status.
- Top priority wins; ties pick at random in the browser after mount.
- `lib/stores/ad-store.ts` (Zustand) keeps, per slot, the banner picked for this page view and which impressions were already sent, so a remount neither swaps the banner nor counts it twice.
- `next/image` for separate desktop and mobile images, 16:9, 16 px radius, label pill top-right per §7.5.
- `target="_blank" rel="sponsored noopener"`. A banner with no link isn't clickable.
- No live banner shows the grey "Advertise here: contact us" box, linking to WhatsApp until Contact exists. A paused slot renders nothing.

**Tracking:** `POST /api/track/ad` takes `{ adId, kind, device }`.

- Impression fires once per page view when half the banner is visible. Click fires on click. Both use `navigator.sendBeacon`.
- The route validates with Zod, confirms the ad is live, inserts into `ad_events` with the secret key, and returns 204. It stores no IP or visitor data.

**Sanskar band:** PRD §8.1 title with ™, subtitle, quote and six stages, on `sanskar-*` tokens. Vertical timeline on mobile; the kalash photo is omitted (no asset). Never "Book a Puja".

**CTA band:** DESIGN §8.2 item 9, on `navy-900`, with the WhatsApp button.

**Footer:** white with navy text. Logo and line, Quick Links (live routes only), Services, WhatsApp, "Silchar, Assam", and "© 2026 Swapnobari". Privacy and Terms appear when those pages go live.

**Today's Price (`/todays-price`):**

- Compact page hero, the label "Indicative prices. Actual price may vary by dealer and quantity.", and the newest updated date.
- Table with City, Material, Brand, Price, Unit, Updated, sorted by those columns. Each row becomes a card on mobile.
- Money uses `Intl.NumberFormat('en-IN')`; dates are IST.
- "Get exact price from sellers near me" opens WhatsApp.
- Cached with tag `prices`. Exports `pageMetadata`. No price data in JSON-LD.

## Data and RLS

No migrations. Reads use the existing `anon` policies through the publishable key. `ad_events` is inserted with the existing `service_role` grant. `PUBLIC_CACHE_TAGS` already has `materials`, `prices` and `ads`.

## Security

- The secret key is used only in the route handler, through `lib/supabase/admin.ts`.
- The beacon validates input and rejects ads that aren't live. It has no rate limit, so counts could be inflated by abuse; no data is exposed.
- No forms are added, so no new lead paths.
- WhatsApp number and messages stay in `lib/env.ts` and `lib/whatsapp.ts`.

## UI

- **Visual interpretation:** DESIGN §8.2 and §8.6 as written, except decisions 6, 7 and 9.
- **Layout and spacing:** `max-w-[1440px] mx-auto px-5 md:px-8 xl:px-12` on every section. Section padding `py-14 lg:py-20`, matching the existing sections.
- **Typography:** Inter throughout, H2 `text-[26px] sm:text-[32px]` bold navy. Playfair only for the Sanskar title.
- **Colours:** `navy-*`, `orange-500` for main actions, `green-500` for WhatsApp only, `sanskar-*`, `gray-*`. Step colours stay as in the existing component.
- **States:** hover, pressed and focus per §7.1; empty ad box; empty prices ("Prices are being updated. WhatsApp us for today's rate."); price load failure shows the user-safe message.
- **Motion:** none beyond the hover lift and zoom; honour `prefers-reduced-motion`.
- **360 px:** no horizontal page scroll (carousels scroll inside themselves); tap targets at least 44 px; chips and pills scroll horizontally.

## Acceptance criteria

- [ ] Home shows every section in the order above
- [ ] No link on Home, header, drawer or footer leads to a 404
- [ ] A price saved in admin appears on `/todays-price` after refresh
- [ ] A live banner shows on Home with its label; pausing the banner brings back the grey box
- [ ] Viewing and clicking the banner adds rows to `ad_events` and the admin report counts them
- [ ] Material chips follow enabled categories in admin
- [ ] No placeholder phone number is visible anywhere
- [ ] Works at 360 px with no horizontal page scroll
- [ ] `/todays-price` is in the sitemap
- [ ] "Book a Puja" and "®" appear nowhere

## Checks

`npx tsc --noEmit`, `npm run lint`, `npm run build`, and the existing tests.

## Manual test

1. `npm run dev`, open `/`, and scroll top to bottom at 1440, 768 and 360 px.
2. Click every link and button; confirm none 404s and WhatsApp messages read correctly.
3. In admin, change a price; refresh `/todays-price`.
4. In admin, pause and resume the banner; refresh Home each time.
5. In admin, open the ads report and confirm impressions and clicks rose.
6. In admin, disable a material category; refresh Home; re-enable it.
