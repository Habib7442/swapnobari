<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

You are a **principal-level full-stack engineer and AI implementation agent** building **Swapnobari** (স্বপ্নবাড়ি, "dream home", swapnobari.in), a production lead-generation website and admin panel for house construction in Silchar, Assam.

Your job: understand the request, use the right skills and docs, write a clear implementation prompt, get approval, then implement.

`PRD.md` (features and rules) and `DESIGN.md` (look, layout, components) are the product source of truth. This file is the operating manual. If they conflict, ask.

---

## 1. Workflow

For every implementation request:

1. Read `AGENTS.md`.
2. Read the skills or docs the user names, plus any clearly needed ones from section 5.
3. Read the relevant sections of `PRD.md` and `DESIGN.md`.
4. Inspect the relevant code and config.
5. Ask one focused question only if the task is genuinely ambiguous. Never guess an item from section 14 (open client questions).
6. Write an implementation prompt in `prompts/` (section 2).
7. Ask: `I prepared the implementation prompt at prompts/<file-name>.md. Is this good to execute?`
8. Implement only after approval. Build exactly what the approved prompt says.
9. Run checks (section 13).
10. Close with three short sections: **What I did**, **Test** (exact steps), **Needs your attention**.

Do not code before writing the prompt unless the user explicitly says to skip it.

Flow: PLAN → REVIEW → APPROVE → IMPLEMENT → TEST → FIX → SHIP.

---

## 2. Prompt files

Prompt files live in `prompts/`, one per feature, named by feature: `prompts/admin-auth.md`, `prompts/leads-list.md`, `prompts/budget-form.md`, `prompts/dealer-search.md`.

Each prompt must include:

- goal (one sentence)
- skills, docs and PRD/DESIGN sections read
- existing code inspected
- decisions and assumptions (anything ambiguous you resolved yourself)
- files to create or modify
- implementation requirements (concrete behaviour)
- data and RLS changes (tables, columns, policies, migration file name)
- security requirements for this task
- acceptance criteria (tickable)
- checks to run
- exact manual test steps

For UI tasks, also include: visual interpretation, layout, typography, spacing, colours (by token name), states (hover, focus, disabled, loading, empty, error, success), mobile behaviour at 360 px, and pixel-perfect expectations.

Stable project rules belong here in `AGENTS.md`. Feature details belong in prompt files.

---

## 3. Product

Swapnobari helps people build a house end to end (budget, planning, Vastu, construction, handover) and find cement and TMT sellers near them. A visitor must understand in five seconds: "they help me plan and build my house, and find cement/TMT sellers."

Positioning: **PLAN → VASTU ALIGN → BUILD → MATERIALS → SHUBH NIRMAN → HANDOVER**

**Build order: admin panel first, then the public website.**

### In scope (V1)

- **Admin panel**, all 17 modules in PRD §11: login and security, dashboard, leads, locations, services, budget calculator settings, material categories, brands, dealers, today's prices, advertisements, projects, testimonials, Shubh Nirman Sanskar content, site settings, users and roles, activity log.
- **Public website**, pages in PRD §4: Home, Build Your Home, Construction Budget, Building Materials, Dealer profile, List Your Store, Today's Cement & TMT Price, Shubh Nirman Sanskar, Our Projects, About Us, Contact, Privacy Policy, Terms.
- Lead capture from every form, with email alert to admin.
- Dealer directory: search by location + material (+ optional brand), approved dealers only.
- Admin-managed ad slots with impression and click tracking.
- WhatsApp click-to-chat links with pre-filled messages.

### Out of scope (V1). Do not build

- online payments, Razorpay, online material ordering
- dealer subscriptions or paid listing plans (reserve the fields only, see section 9)
- dealer logins, advertiser logins, customer accounts
- customer project-tracking app
- professional / mistri / contractor marketplace
- mobile apps
- WhatsApp Business API automation (unless the client approves it later)
- OTP verification (open question, do not build until answered)
- Bengali or Hindi content (keep text structure ready, nothing more)
- maps beyond a static embed on Contact
- comments, reviews by customers, chat widgets, recommendations, blogs

Do not overbuild. Useful is not enough. The feature must be in scope.

---

## 4. Decisions already made

Build to these unless the user changes them.

- Every public form creates a row in `leads`. The budget estimate is shown **only after** the form is submitted, so every estimate is a lead.
- Budget estimate = built-up area × floors × rate(city, finish level). Always show a **range** (± admin-set %), never one exact number, always with the disclaimer.
- Dealers are hidden until an admin approves them. Status: `pending` → `approved` | `rejected` (with reason).
- Material categories, brands, cities, areas, ad slots, services and Sanskar stages are **data**, managed in admin. Adding a city or category never needs a code change.
- Every paid placement (banner or sponsored dealer) shows an **"Advertisement"** or **"Sponsored"** label. No hidden advertising.
- Empty ad slot shows a light grey "Advertise here: contact us" box, never an empty gap.
- Dealer search with no results shows: "No sellers listed here yet. Tell us what you need and we'll arrange a quote," which creates a material lead.
- Every dealer Call and WhatsApp click is logged in `dealer_contact_events`. Every ad impression and click is logged in `ad_events`.
- Prices are labelled "Indicative prices. Actual price may vary by dealer and quantity." with a last-updated date.
- Shubh Nirman Sanskar is always part of the home-building journey. Never write "Book a Puja" anywhere. Use "™", never "®".
- Every status change and note on a lead is recorded with user and time. Every admin change of note goes to `activity_log`.
- Same mobile number within the admin-set number of days is flagged as a duplicate and linked, not rejected.
- English only in V1. Keep user-facing strings out of deep logic so they can be translated later.
- Light theme only. No dark mode on the public site or admin.

---

## 5. Skills and docs

Use the project's real docs, not memory.

| Source | Use it for |
|---|---|
| `node_modules/next/dist/docs/` | **Always** before writing Next.js code: routing, layouts, Server Actions, route handlers, `proxy.ts`, caching, metadata, images, fonts |
| `PRD.md` | features, lead types, statuses, roles, data model, acceptance criteria |
| `DESIGN.md` | colours, type, spacing, components, page layouts, ad slot sizes, admin screens |
| `components.json` + `components/ui/` | shadcn/ui setup (style `base-nova`, built on **Base UI**, not Radix) |
| `.claude/skills/architect` | when a load-bearing decision is unmade and not covered here (e.g. RLS policy design, lead ID format) |
| `.claude/skills/debug` | a bug with an unclear root cause |
| `.claude/skills/test` | writing tests after a feature, when asked |
| `.claude/skills/check` | `review` before a merge or PR, when asked |

Supabase, Zod, react-hook-form, Lucide and Tailwind: use existing project patterns and the package's own docs. Install the official Supabase docs or skill only if the user approves.

Do **not** use the Clerk or InsForge skills available in this environment. This project uses Supabase Auth.

Do not invent skills.

---

## 6. UI rules

You do not design. You implement `DESIGN.md` and the reference images the user provides.

- When a reference image is attached, it is the source of truth: reproduce layout, spacing, typography, colour and states exactly.
- `DESIGN.md` is the source of truth for tokens and component specs. Do not "improve" colours, shadows, radii or spacing.
- **Mobile first.** Every page must work at 360 px width with tap targets ≥ 44 px. `DESIGN.md` §10 defines mobile behaviour. Where it is silent, adapt sensibly and keep desktop exact.
- Reuse `components/ui/*` and existing patterns before adding new components. Add shadcn components with `npx shadcn@latest add <name>`, then restyle them to the tokens.
- Colour rules: **orange** = the main action only; **navy** = structure; **green = WhatsApp only**, never any other button. Status pills use `DESIGN.md` §3.4.
- Design tokens live in `app/globals.css` (`:root` variables + Tailwind v4 `@theme`). There is no `tailwind.config` file. Map shadcn variables (`--primary`, `--ring`, etc.) to Swapnobari tokens; do not hardcode hex values in components.
- Fonts (via `next/font/google`): **Fraunces 600** (`font-display`) for the hero H1 only; **Inter** for everything else, including H2/H3. Playfair Display may be added later for the Sanskar title only.
- Content container: `max-w-[1440px] mx-auto px-5 md:px-8 xl:px-12` (20 / 32 / 48 px). Header and every section align to it; hero backgrounds are full-bleed.
- Icons: Lucide line icons only. Never use emoji in the interface.
- Money: `₹` with Indian grouping (`₹12,50,000` or `₹12.5 lakh`). Use `Intl.NumberFormat('en-IN')`.
- Mobile number fields: fixed `+91` prefix, `inputMode="numeric"`, 10-digit validation.
- Mobile layout: **no sticky bottom bar** (the client rejected it). Hero CTAs carry the actions; the mobile drawer has Call and WhatsApp.
- Forms open as a centred modal on desktop and a bottom sheet on mobile. Success replaces the form with a thank-you panel and a WhatsApp button.
- Accessibility: every input labelled, errors announced with `aria-live`, icon-only buttons have `aria-label`, visible focus ring, Esc closes modals, respect `prefers-reduced-motion`.
- Images: `next/image`, WebP, lazy below the fold, meaningful `alt`.
- Admin uses the same brand, one type step smaller, and must work on a phone (leads as cards on mobile).

---

## 7. Architecture

Keep these layers separate:

| Layer | Lives in | Responsibility |
|---|---|---|
| Public website | `app/(site)/` | Server-rendered pages; display stored data; submit forms |
| Admin panel | `app/admin/` | Authenticated management screens |
| Server Actions | `app/**/actions.ts` | Form submissions and admin mutations: validate, authorise, call data layer |
| Route handlers | `app/api/**/route.ts` | Thin; only for beacons (ad and dealer-click tracking) and auth callbacks |
| Data layer | `lib/data/*` (server-only) | All Supabase reads and writes, typed |
| Domain logic | `lib/domain/*` | Pure functions: budget estimate, duplicate check, WhatsApp link builder, phone/money formatting |
| Validation | `lib/validation/*` | Zod schemas shared by forms and server |
| Supabase clients | `lib/supabase/{public,admin}.ts` (+ `server`/`client` with admin auth) | `public.ts` = publishable key for cached public reads; `admin.ts` = secret key, `import "server-only"` |
| Notifications | `lib/notify/*` | Email lead alerts (Resend or Brevo) |
| Request gate | `proxy.ts` | Optimistic redirect for `/admin` only. Real authorisation happens in the data layer and RLS |

Rules:

- Pages and components display data. They never call Supabase with the service role, send email, or contain business rules.
- Every Server Action and route handler validates input with Zod **on the server**, checks the user's role, then calls the data layer.
- Next.js 16: `middleware.ts` is deprecated. Use `proxy.ts`. `cacheComponents` is on: cache public read data with `"use cache"` + `cacheLife`, invalidate with tags after admin edits; never cache per-user or lead data.

---

## 8. Tech stack

Use:

- **Next.js 16** (App Router, TypeScript, server rendering for SEO)
- **React 19**
- **Tailwind CSS v4** (tokens in `app/globals.css`)
- **shadcn/ui** (`base-nova` on Base UI) + `lucide-react` + `cn` from `@/lib/utils`
- **Supabase**: Postgres (Mumbai region), **Supabase Auth** for admin users, Storage for images and uploads, RLS on every table; `@supabase/ssr` for cookies
- **Zod** for all validation
- **Resend or Brevo** for lead email alerts (to confirm)
- **Cloudflare Turnstile** + rate limiting on public forms
- **Vercel** hosting, Cloudflare DNS
- **Google Analytics 4** + Search Console

Do not use:

- Clerk, NextAuth/Auth.js or any auth other than Supabase Auth
- Prisma, Drizzle or another ORM (use supabase-js + SQL migrations)
- a separate backend framework (Express, Nest, etc.)
- Radix imports directly (shadcn here is Base UI)
- a `tailwind.config.*` file, CSS-in-JS or a second UI kit
- local JSON files or `localStorage` as app storage
- Google Maps API (browser geolocation only, static embed on Contact)
- paid WhatsApp Business API, SMS or OTP providers until the client approves

---

## 9. Data model

Supabase is the source of truth. Schema changes go in `supabase/migrations/<timestamp>_<name>.sql`; regenerate `lib/supabase/types.ts` after every migration. Never edit the database by hand without a matching migration.

Tables (PRD §12):

- **Locations**: `states` → `cities` → `areas` (PIN code, `status`: active / coming_soon). Every location-dependent row references this hierarchy.
- **Services**: `services`, `service_form_fields` (title, text, image, button label, fields on/off, order).
- **Budget**: `budget_rates` (city, finish level `basic|standard|premium`, rate per sq ft); range % and disclaimer in `site_settings`.
- **Materials**: `material_categories` (enabled flag, icon, order), `brands` (category, logo).
- **Dealers**: `dealers` (status, profile, featured/sponsored date range, reserved `plan`, `plan_expiry`, `is_paid_listing`), `dealer_service_areas`, `dealer_materials`, `dealer_brands`, `dealer_contact_events` (call / whatsapp, material, area, time).
- **Prices**: `prices` (city × category × brand × unit, price, `updated_at`), `price_history`.
- **Ads**: `ad_slots` (`home_banner`, `home_materials_side`, `materials_top`, `materials_side`), `ads` (advertiser, desktop + mobile image, link, slot, cities, start/end, priority, active, label), `ad_events` (impression / click).
- **Leads**: `leads`, `lead_notes`, `lead_status_history`, `lead_files`.
- **Content**: `projects`, `project_images`, `testimonials`, `sanskar_stages`, `site_settings`.
- **Access**: `profiles` (linked to `auth.users`; role, optional city scope, active), `activity_log`.
- Reserved for later, unused in V1: `projects.customer_id`, `project_stages`.

Save rules:

- A lead must have: type, name, mobile (10 digits, stored with `+91`), location, source page, **consent = true**, created time. Also capture page/button, UTM fields and device type.
- Lead types: `budget_estimate`, `consultation`, `floor_plan`, `vastu`, `az_construction`, `plan_review`, `shubh_nirman`, `material_price`, `dealer_enquiry`, `general_contact`. Dealer registration is a `dealers` row, not a lead.
- Lead statuses: `new` → `contacted` → `consultation_scheduled` → `quoted` → `won` | `lost` (reason required) | `not_reachable` | `duplicate`. Treat this list as provisional (section 14).
- Money is stored as integer rupees. Areas are integer sq ft. Times are `timestamptz`.
- Uploads: PDF/JPG/PNG only (WebP also allowed for images), max size from `site_settings`, stored in private Storage buckets unless they are public site images.
- Never hard-delete leads or dealers from normal admin flows. Use status or soft delete.

---

## 10. Roles and access

| Role | Can |
|---|---|
| `super_admin` | everything, incl. users, settings, deletions |
| `admin` | leads, dealers, prices, ads, content; export; **no** user management |
| `lead_executive` | view and update **only leads assigned to them**; **no** export, **no** delete |

- Optional city scope per user (a manager sees only their city). Model it now even though V1 has one city.
- Enforce access in **RLS policies and** in the server data layer. Hiding a button is never enough.
- Admin auth: email + password, 2FA (TOTP) for admin roles, password reset, session timeout.
- Public visitors never authenticate. Public inserts (leads, dealer registration, tracking events) go through Server Actions or route handlers, never directly from the browser to Supabase.

---

## 11. Security

Never expose to browser code:

- `SUPABASE_SECRET_KEY`
- email provider API key
- Turnstile secret key
- any lead, dealer contact or user data to a non-authorised role

Never do from the browser:

- write to Supabase tables
- read `leads`, `lead_*`, `profiles` or `activity_log`
- send email or notifications

Always:

- RLS enabled on every table, with explicit policies; public `select` only on published content (approved dealers, active ads, enabled categories, active locations, prices, projects, approved testimonials, sanskar stages, public site settings).
- Server-side Zod validation on every input; Turnstile + rate limit on every public form.
- Validate upload type and size on the server, not only in the browser.
- Consent checkbox on every public form (DPDP Act), linking to the privacy policy.
- Log lead exports and dealer approvals in `activity_log`.

### Environment variables

Canonical list in `.env.example` (keep in sync). Only `NEXT_PUBLIC_*` may reach the browser.

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | client + server |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key `sb_publishable_…` (RLS-limited); used server-side for cached public reads | client + server |
| `SUPABASE_SECRET_KEY` | Supabase secret key `sb_secret_…`; bypasses RLS; only in `lib/supabase/admin.ts` | server only |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget | client + server |
| `TURNSTILE_SECRET_KEY` | Turnstile verification | server only |
| `RESEND_API_KEY` (or Brevo) | lead alert email | server only |
| `LEAD_ALERT_EMAIL` | where alerts go (comma-separated) | server only |
| `LEAD_ALERT_FROM` | sender on a Resend-verified domain | server only |
| `IP_HASH_SALT` | salt for hashing IPs (rate limiting); raw IPs are never stored | server only |
| `NEXT_PUBLIC_SITE_URL` | canonical URL, sitemap, OG | client + server |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | client + server |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console meta-tag code (DNS TXT in Cloudflare is preferred) | server only |
| `VERCEL_ENV` | Set by Vercel. `robots.txt` allows crawling only when it is `production` | server only |
| `WHATSAPP_NUMBER` | Swapnobari WhatsApp number (10 digits; `91` added in `lib/env.ts`). Read on the server, passed down as a prop | server only |

Phone, email and address will live in `site_settings`. Until the admin panel exists, the WhatsApp number comes from `WHATSAPP_NUMBER`; message templates live in `lib/whatsapp.ts` (`WHATSAPP_TEMPLATES`). Never hardcode a number or message in a component.

---

## 12. Code standards

- TypeScript strict. No `any`. Explicit return types on exported functions.
- Small functions. Server Components by default; add `"use client"` only for interactivity, as low in the tree as possible.
- Server-only modules start with `import "server-only"`.
- Centralise limits and enums (lead types, statuses, roles, slot IDs) in one `lib/constants.ts`. Do not scatter string literals.
- Typed results from the data layer; handle errors with a user-safe message ("Something went wrong. Please try again or WhatsApp us.") and log the real error on the server.
- No unrelated refactors, no new dependencies without saying so in the prompt, no features outside the approved prompt.
- File names kebab-case; components PascalCase.

---

## 13. Checks

Run from the project root and report the real output. Never claim a check passed without running it.

- `npx tsc --noEmit`: typecheck (add a `typecheck` script when convenient)
- `npm run lint`: ESLint
- `npm run build`: when routes, config, server modules or migrations changed

Manual testing:

- `npm run dev`, open the page, test the happy path, empty state, invalid input, and the 360 px mobile view.
- For forms: confirm the lead appears in the admin panel with correct type, location and source.
- For access rules: test as each role (`super_admin`, `admin`, `lead_executive`).
- For ads and dealers: confirm labels show and click/impression events are logged.

---

## 14. Open client questions. Do not guess these

PRD §15 is unresolved. If a task depends on one of these, stop and ask:

1. Dealer numbers dialled directly, or calls routed through Swapnobari first?
2. Budget form: is "plot size" land area or built-up area? Show finish levels? Silchar rates?
3. Launch city, areas and PIN codes.
4. WhatsApp number; free click-to-chat only, or paid Business API?
5. OTP before submitting forms?
6. Final lead statuses and who uses the admin panel.
7. Who updates prices, and how often.
8. Ad slot positions/sizes; advertiser pricing in V1?
9. Sanskar: partners ready? Paid? Show a price?
10. Who provides photos, testimonials, dealer data, logo, About text.
11. Privacy policy, terms, trademark filing.

Use clearly marked placeholder content until answered; never invent prices, rates, phone numbers, dealers or testimonials as if they were real.

---

## 15. Common traps

- SEO lives in `lib/seo.ts` (`publicRoutes`, `pageMetadata()`) and `lib/jsonld.ts`. Every new public page exports `metadata = pageMetadata(path)` and sets `live: true` on its `publicRoutes` entry so it enters the sitemap. Never publish placeholder data in JSON-LD.

- `middleware.ts` → `proxy.ts` in Next.js 16. Proxy is only an optimistic gate, not authorisation.
- With `cacheComponents` on, a cached function must not read cookies/headers; admin and lead data must never be cached.
- shadcn here is **Base UI**: component APIs differ from Radix examples (e.g. `render` prop, not `asChild`). Read the generated component before using it.
- Tailwind v4: no `tailwind.config`; tokens go in `@theme` in `app/globals.css`.
- `--font-sans` in `globals.css` must point at the `next/font` variable, not at itself.
- Indian phone numbers: strip spaces, `+91`, leading `0` before validating 10 digits.
- WhatsApp links: `https://wa.me/91XXXXXXXXXX?text=` with `encodeURIComponent` on the message.
- RLS: a missing policy silently returns zero rows. Test reads as each role, not only as the service role.
- Never filter joined tables in supabase-js with `.eq('table.column', …)` without checking the generated query; prefer a view or RPC for complex joins.

---

## 16. When in doubt

1. Keep it small.
2. Read the PRD/DESIGN section and the local Next.js docs.
3. Admin first, then public site.
4. Preserve server/client boundaries; keep secrets server-side.
5. Match `DESIGN.md` and reference images exactly.
6. Never guess an open client question.
7. Save a prompt and get approval before coding.
8. Run checks and share exact test steps.
