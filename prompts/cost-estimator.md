# Prompt: House construction cost estimator (production)

> **Built 23 Oct 2026** (code complete; end-to-end test pending the database migration). Differences from this plan:
> - Supabase's new key names: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` (public reads via `lib/supabase/public.ts`, writes via `lib/supabase/admin.ts`).
> - No areas are seeded (open question §14.3): the form shows a free-text "Area / locality" until areas are added in the DB, then a dropdown with "Other".
> - The optional "plot length × width" helper was left out; the field is "Area (sq ft)" of one floor.
> - Reference data uses the `minutes` cache profile (edits in Supabase show within ~5 minutes).
> - Turnstile fails open (with a server warning) if its secret is missing or Cloudflare is unreachable; the per-IP rate limit still applies. Email failures never block the lead.
> - Header nav moved its active-link state behind `<Suspense>` so dynamic routes (the result page) can prerender.

## Goal

Turn `/construction-budget` into a production cost calculator like bricknbolt.com/cost-estimator: a visitor enters plot size, floors, area, name and mobile, the lead is saved in Supabase with an email alert, and the full estimate (range, package comparison, stage-wise and floor-wise breakdown) is shown instantly on the site from admin-controlled rates.

## Read

- `AGENTS.md` (all; especially §4 decisions, §7 architecture, §9 data model, §11 security, §14 open questions)
- `PRD.md` §6.1 (budget logic), §6.3–6.4 (lead fields, after submission), §10 (leads), §12 (data model), §13 (security), §17 (acceptance)
- `DESIGN.md` §8.4 (Construction Budget page), §7.2 (form fields), §7.8 (success state)
- Reference: https://www.bricknbolt.com/cost-estimator (layout and section order, not copy or numbers)
- Next.js docs: `02-guides/forms.md` (Server Actions + `useActionState`), `02-guides/server-actions.md` (security), `02-guides/data-security.md` (data access layer, re-verify in actions), `01-getting-started/06-fetching-data.md` + `08-caching.md` (`<Suspense>` for request-time data with `cacheComponents`)

## Code inspected

- `components/home/budget-card.tsx`: client-only validation, fake success, nothing saved
- `app/(site)/construction-budget/page.tsx`: static page with the card and a "How we calculate" list
- `components/home/hero.tsx`: desktop hero uses `BudgetCard`; mobile CTA links to `/construction-budget`
- `lib/env.ts`, `lib/whatsapp.ts`, `lib/seo.ts`, `lib/jsonld.ts`
- No Supabase, Zod, Resend or Turnstile installed yet

## Decisions and assumptions (review these)

1. **Name + mobile before the result** (AGENTS §4: every estimate is a lead). Form: plot size, floors, area, name, mobile, consent. No OTP (open question).
2. **Shareable result page:** submitting saves the lead and redirects to `/construction-budget/estimate/[token]` (random 24-char token stored on the lead). The visitor can bookmark or WhatsApp the link; the team can open the same link from the lead. Page is `noindex`. It shows only estimate figures and the first name, never the mobile number.
3. **Same form everywhere:** the homepage desktop card and the estimator page use one `EstimatorForm` and one Server Action, so both create leads and land on the result page.
4. **Rates live in Supabase, not in code.** The client edits them in the Supabase table editor until the admin panel's "Budget Settings" screen exists. **No real rates → no invented numbers:** if a city/package has no active rate, the lead is still saved and the result page says "Our team will send your estimate on WhatsApp within X hours" instead of figures.
5. **Size input = built-up area per floor (sq ft)**, with an optional "plot length × width" helper that fills it. This is open question §14.2; the label is one string to change if the client means land area.
6. **Packages:** Basic / Standard / Premium (DESIGN §8.4 finish levels). Names, per-sq-ft rates and "what's included" rows are data.
7. **Stage breakdown percentages** are data, seeded with typical Indian residential splits **for the client to confirm before launch**: Design & approvals 3 · Excavation & foundation 12 · RCC structure 25 · Brickwork & plastering 15 · Flooring & tiling 10 · Electrical 6 · Plumbing & sanitary 7 · Doors & windows 8 · Painting & finishing 8 · Contingency & misc 6 (= 100).
8. **Range:** ± `estimate_range_percent` from `site_settings` (default 10). Shown in lakh, e.g. "₹38.2L – ₹46.7L", always with the disclaimer.
9. **Floor-wise breakdown:** per-floor cost = area × rate; the foundation stage is added to the ground floor.
10. **Spam:** Cloudflare Turnstile (free, invisible) + rate limit of 5 submissions per IP per 10 minutes, counted in the `leads` table by a salted IP hash (no Redis). Duplicate mobile within `duplicate_window_days` (default 30) is flagged and linked, not rejected.
11. **Email alert:** Resend to `LEAD_ALERT_EMAIL`. If email fails, the lead is still saved and the error is logged (never lose a lead).
12. **Estimate is computed on the server** from DB rates; the client never sends prices.
13. **Advisor form** at the bottom ("Talk to an advisor": name, mobile, area) creates a `consultation` lead through the same pipeline.
14. **Locations:** seed Silchar with a short area list the client must confirm (open question §14.3). Area is a select plus "Other / not listed".

## New dependencies

`@supabase/supabase-js`, `zod`, `resend`. (Turnstile via its plain script + server `fetch` verify; no package.) `@supabase/ssr` is added later with admin auth.

## Data and RLS (migration `supabase/migrations/20261023000000_estimator_and_leads.sql`)

| Table | Key columns | RLS |
|---|---|---|
| `states`, `cities`, `areas` | name, slug, pin (areas), status `active`/`coming_soon`, sort | public `select` where active |
| `budget_packages` | slug (`basic`/`standard`/`premium`), name, tagline, sort, is_active | public `select` active |
| `budget_rates` | city_id, package_id, rate_per_sqft (int ₹), is_active, updated_at | public `select` active |
| `budget_package_features` | package_id, label (e.g. "Cement"), value (e.g. "ACC / UltraTech"), sort | public `select` |
| `budget_stages` | name, percent (numeric), sort, applies_to_ground_only (bool) | public `select`; check sum = 100 in app |
| `site_settings` | key, value (jsonb), is_public | public `select` where is_public |
| `leads` | id, ref_code (`SB-000123`), type, name, mobile (+91…), city_id, area_id, area_other, details (jsonb: size, floors, package, estimate snapshot), source_page, source_button, utm_* , device, consent, status `new`, is_duplicate, duplicate_of, result_token, ip_hash, created_at | **no public access**; inserts only via service role in the Server Action |

Plus `lib/supabase/types.ts` (generated) and a seed file `supabase/seed.sql` with Silchar, packages (rates `NULL` until the client fills them), stages and settings.

## Files to create or modify

Create:

- `lib/supabase/admin.ts` (service-role client, `server-only`)
- `lib/data/estimator.ts` (cached reads: cities/areas, packages, rates, features, stages, settings; `"use cache"` + `cacheLife("hours")` + tag `estimator`)
- `lib/data/leads.ts` (insert lead, duplicate check, rate-limit count, read estimate by token; `server-only`)
- `lib/domain/estimate.ts` (pure: area × floors × rate, range, stage and floor breakdown, lakh formatting) + unit-testable
- `lib/domain/phone.ts` (normalise/validate Indian mobile)
- `lib/validation/estimator.ts` (Zod schemas shared by form and action)
- `lib/notify/lead-alert.ts` (Resend email)
- `lib/security/turnstile.ts` (verify token), `lib/security/request.ts` (IP hash, device type)
- `lib/constants.ts` (lead types, statuses, limits)
- `app/(site)/construction-budget/actions.ts` (`submitEstimate`, `requestAdvisor`)
- `app/(site)/construction-budget/estimate/[token]/page.tsx` (result page, `<Suspense>` around the DB read, `noindex`)
- `components/estimator/estimator-form.tsx` (client, `useActionState`, pending state, inline errors, Turnstile)
- `components/estimator/result-summary.tsx`, `package-cards.tsx`, `stage-breakdown.tsx`, `floor-breakdown.tsx`, `package-comparison.tsx`, `estimator-faq.tsx`, `advisor-form.tsx`
- `supabase/migrations/…sql`, `supabase/seed.sql`, `docs/supabase-setup.md`

Modify:

- `app/(site)/construction-budget/page.tsx` (full calculator page)
- `components/home/hero.tsx` (desktop card uses `EstimatorForm`)
- `components/home/budget-card.tsx` (becomes a thin wrapper or is removed)
- `lib/seo.ts` (FAQ + updated description), `lib/jsonld.ts` (FAQPage on the page)
- `.env.example`, `AGENTS.md` §11 env table

## Implementation requirements

### Page layout (`/construction-budget`, following the reference order)

1. **Hero:** H1 "House Construction Cost Calculator", short intro, trust stats (only real numbers; hidden until the client supplies them), "indicative rates per sq ft" strip for the 3 packages (from DB; hidden if no rates), "How are these rates estimated?" note. Right: the form card.
2. **Result section** (on the result page): navy band with the total range for the selected package, the input summary ("1,200 sq ft · G+1 · Tarapur, Silchar"), package cards (Basic / Standard / Premium, each with its range; the selected one highlighted), stage-wise breakdown (bars with % and ₹), floor-wise breakdown, disclaimer, and buttons "Talk to an advisor" and "Discuss on WhatsApp" (green, `estimateRequested` template with the ref code).
3. **What's included in each package:** comparison table from `budget_package_features` (cards on mobile).
4. **CTA band:** "Most families underestimate their build cost. Talk to us before you start."
5. **FAQ:** 10–12 questions (accordion), also as FAQPage JSON-LD.
6. **Talk to an advisor:** short form → `consultation` lead.

### Form and action

- Fields: built-up area per floor (sq ft, 200–20,000) with optional L × W helper; floors (G, G+1, G+2, G+3); area (select + other); name (2–60 chars); mobile (+91, 10 digits starting 6–9); consent checkbox linking to `/privacy`; hidden: package (default `standard`), source page/button, UTM params, Turnstile token.
- Action order: Zod validate → Turnstile verify → rate limit → normalise phone → duplicate check → compute estimate (if rates exist) → insert lead with `result_token` → email alert (non-blocking for the result) → `redirect` to the result page.
- Errors: field errors inline (`aria-live`); top-level "Something went wrong. Please try again or WhatsApp us." for server failures; button shows a spinner and keeps its width.

### Responsive

- 360 px: single column, form first, result cards stacked, comparison table becomes per-package cards, breakdown bars full width.
- Desktop: two columns in the hero (text left, form right), result band two columns (summary + packages left, breakdown right) like the reference.

## Security requirements

- Service-role key only in `lib/supabase/admin.ts` (`server-only`); browser never talks to Supabase for leads.
- RLS enabled on every new table; `leads` has no anon/authenticated policies.
- Server-side Zod on every field; Turnstile verified server-side; rate limit per IP hash (salted with `IP_HASH_SALT`, raw IP never stored).
- Result token is random (crypto), not the lead id; result page exposes no mobile number or other leads.
- Consent required (DPDP). Privacy page link (page itself is a separate task; until then link to `/privacy` "Coming soon").

## Environment variables (new)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `LEAD_ALERT_EMAIL`, `LEAD_ALERT_FROM` (e.g. `Swapnobari <leads@swapnobari.in>`), `IP_HASH_SALT`.

## Acceptance criteria

- [ ] Submitting valid details creates a `leads` row (type `budget_estimate`, correct area, source page/button, consent true) and redirects to the result page.
- [ ] With rates set: the result shows a range (never a single number), all 3 packages, stage-wise and floor-wise breakdowns, and the disclaimer; figures match `lib/domain/estimate.ts`.
- [ ] Without rates for that city/package: the lead is saved and the "we'll send your estimate" message shows; no made-up numbers anywhere.
- [ ] Changing a rate in Supabase changes new estimates (after cache revalidation, at most 1 hour or on tag revalidation).
- [ ] Admin email arrives within a minute; if Resend fails, the lead is still saved.
- [ ] Invalid input shows inline errors; a missing/invalid Turnstile token or > 5 submissions in 10 minutes from one IP is rejected with a friendly message.
- [ ] Same mobile within 30 days is saved with `is_duplicate = true` and `duplicate_of` set.
- [ ] Homepage desktop card submits through the same flow.
- [ ] Result page is `noindex`, shows no mobile number, and 404s for an unknown token.
- [ ] Works at 360 px with no horizontal scroll; keyboard and screen-reader friendly.
- [ ] Typecheck, lint, build pass; `lib/domain/estimate.ts` unit tests pass.

## Checks to run

`npx tsc --noEmit` · `npm run lint` · `npm run build` · unit tests for `lib/domain/estimate.ts` (Vitest, dev dependency) · manual flow below.

## Manual test steps

1. Follow `docs/supabase-setup.md`: create the project (Mumbai), run the migration and seed, fill env vars.
2. In the Supabase table editor, set test rates for Silchar (e.g. Basic/Standard/Premium).
3. `npm run dev` → `/construction-budget` → submit valid details → land on the result page; check the numbers by hand: area × floors × rate ± 10%.
4. Check the `leads` row and the alert email.
5. Clear the rates → submit again → "we'll send your estimate" message, lead saved.
6. Submit the same mobile again → `is_duplicate` true.
7. Submit 6 times quickly → 6th is blocked.
8. Submit empty / 9-digit mobile / no consent → inline errors.
9. Repeat on the homepage desktop card and at 360 px.

## Needs your input before I build

1. **Supabase:** create a free project at supabase.com (region **Mumbai / ap-south-1**) and share the project URL + anon key + service-role key in `.env.local` (I'll guide you).
2. **Turnstile:** in Cloudflare → Turnstile → add widget for `swapnobari.in` + `localhost` → site key + secret key.
3. **Resend:** create an account, add the domain `swapnobari.in` (it adds DNS records in Cloudflare), get an API key; tell me which email should receive leads.
4. **Client data (can arrive after the build; the page handles missing rates):** per-sq-ft rates for each package, what each package includes, stage percentages (or approve the defaults above), Silchar areas list, "plot size" meaning, and real trust stats if any.
