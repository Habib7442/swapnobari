# Material enquiry lead form and ad alt text

## Goal

When a seller search has no results, collect a material enquiry as a lead (not only a WhatsApp link), and give each banner admin-written alt text.

## Read

- `AGENTS.md` §4 (no-results lead, ad labels), §6, §9 (lead save rules), §11
- `PRD.md` §7.2 (lead forms), `DESIGN.md` §7.1 (forms), §8.5
- `prompts/home-polish-dealers.md` decision 8 (lead form deferred to this slice)
- Code review findings on `dealer-results.tsx`, `materials-section.tsx`, `ad-banner-client.tsx`

## Existing code inspected

- `app/(site)/construction-budget/actions.ts`: `fields()`, `guard()` (Turnstile + per-IP rate limit), `resolveLocation()`, `insertLead()`, `sendLeadAlert()` in `after()`
- `components/estimator/advisor-form.tsx`, `field.tsx`, `location-fields.tsx`, `tracking-fields.tsx`, `turnstile.tsx`
- `lib/validation/estimator.ts` (`name`, `mobile`, `consent`, `tracking`, `location` pieces)
- `lib/data/leads.ts`, `lib/data/estimator.ts` (cities and areas)
- `lib/data/ads.ts`; admin migration `20261112000000_ads.sql`: `anon` can't read `advertiser_name`, and there is no description column

## Decisions and assumptions

1. **Lead type `material_price`.** It is a material enquiry, not about one dealer (`dealer_enquiry` stays for a dealer-specific form later).
2. **Inline form, not a modal.** It replaces the empty-results panel on `/building-materials`, so it works without JS and is the page's main content at that moment. The success panel shows a thank-you, the reference code and a WhatsApp follow-up button (AGENTS §6).
3. **Home empty state links to the form.** When Home has no approved dealers, the button reads "Request a Quote" and goes to `/building-materials#quote`. Home doesn't render a second copy of the form.
4. **Get Price stays on WhatsApp** (unchanged; decision 1 of the previous slice).
5. **Ad alt text is a new nullable `ads.alt_text` column** (max 150 characters), entered in the admin ad form and granted to `anon`. It describes the advertised content, for example "Locallify: list your shop online". When it's empty, the alt and link name fall back to the label. `advertiser_name` stays private.
6. Shared Zod pieces (`name`, `mobile`, `consent`, `tracking`, `location`) move from `lib/validation/estimator.ts` to `lib/validation/lead-fields.ts`, and the estimator imports them from there. No behaviour change.
7. `guard`, `fields` and `resolveLocation` move to `lib/security/lead-guard.ts` / `lib/domain/location.ts` so both actions share them. No behaviour change.

## Files

Create:

- `app/(site)/building-materials/actions.ts`: `requestMaterialQuote(prev, formData)`
- `lib/validation/material-enquiry.ts`, `lib/validation/lead-fields.ts`
- `lib/security/lead-guard.ts`
- `components/dealers/material-enquiry-form.tsx` (client, `useActionState`)

Modify:

- `components/dealers/dealer-results.tsx`: no results → the form (with `id="quote"`), preselecting the searched material, brand and city
- `components/home/materials-section.tsx`: empty-state button → "Request a Quote" link to `/building-materials#quote`
- `app/(site)/construction-budget/actions.ts`, `lib/validation/estimator.ts`: import the shared pieces
- `lib/data/ads.ts` (`altText`), `components/ads/ad-banner-client.tsx`
- `lib/supabase/types.ts` (regenerated, both repos)
- Admin repo: migration, `components/ads/ad-form.tsx` and its schema/action

## Implementation

**Form fields:** Material (select, required, enabled categories), Brand (optional, filtered by material like the search form), Quantity / details (optional text, max 200), Name, Mobile (+91), City/Area (`LocationFields`), consent, Turnstile, hidden tracking fields (`sourceButton="materials_no_results"`).

**Action:** Validate with Zod. Run `guard()`. Check that the material is enabled and the brand belongs to it, otherwise ignore the brand. Then `insertLead({ type: "material_price", details: { materialSlug, materialName, brandSlug?, brandName?, quantity? } })`, and send `sendLeadAlert` in `after()` with Material, Brand, Quantity and Source lines. It returns `{ status: "success", message: refCode }` or a user-safe error. It never throws to the client.

**Success panel:** "Thank you, {first name}! We'll call you with prices soon. Reference: {code}", plus a green "WhatsApp Us" button with the material filled in (`whatsappMessage("materials", …)`).

**Ads:** `getSlotAds` selects `alt_text`. `LiveAd.altText: string | null`. Image `alt` = `altText ?? label`. Link `aria-label` = `` `${label}: ${altText}, opens in a new tab` `` (or the current text when it's null). The visible label badge is unchanged.

## Data and RLS

Admin migration `<timestamp>_ads_alt_text.sql`:

- `alter table public.ads add column alt_text text check (alt_text is null or char_length(alt_text) between 3 and 150);`
- `grant select (alt_text) on public.ads to anon;` and add `alt_text` to the `authenticated` update grant and the save RPC
- Regenerate `lib/supabase/types.ts` in both repos

Leads use the existing `service_role` insert path. No other change.

## Security

- Turnstile + rate limit + server-side Zod on the new action; consent is required
- No dealer data is read; the lead is written only with the secret key in `lib/data/leads.ts`
- `alt_text` is plain text, rendered by React (escaped)

## UI

- Form card matches `advisor-form.tsx` (white, `shadow-brand-md`, 10 px inputs, 48 px controls); submit button is orange ("Request Quote"), the main action on that panel
- States: pending (spinner, disabled), field errors (`aria-live`), top-level error, success
- 360 px: single column, full-width button, no sideways scroll

## Acceptance criteria

- [ ] A search with no results shows the form; submitting it creates a `material_price` lead with the material, brand and source, and the admin gets an email alert
- [ ] Invalid input shows field errors; a failed Turnstile or rate limit shows the message, not a crash
- [ ] Success shows the reference code and a WhatsApp follow-up button
- [ ] The form works with JavaScript disabled (plain POST via the Server Action)
- [ ] Home with no dealers links to the form; zero-seller material cards reach it
- [ ] Get Price is unchanged
- [ ] A banner with alt text uses it for the image alt and link name; without one, it falls back to the label; the "Advertisement" or "Sponsored" badge still shows
- [ ] Budget estimator and advisor forms behave exactly as before

## Checks

`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` (both repos for the migration and types).

## Manual test

1. Open `/building-materials?material=<a category with no sellers>`; submit an empty form, then a valid one. Confirm the lead appears in admin as Material price, with the details.
2. Repeat with JS disabled.
3. In admin, add alt text to the Locallify banner; check the image alt and link name in DevTools on Home.
4. Submit a budget estimate to confirm nothing regressed.
