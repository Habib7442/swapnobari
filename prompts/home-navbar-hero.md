# Prompt: Home navbar + hero (client preview)

> **Revision 2 (built), 12 Oct 2026.** The user supplied a reference image (Stonevera-style hero) and `public/hero_bg.webp`, and asked to match the reference. The reference image is the source of truth (`AGENTS.md` §6); the sections below are the original plan and are superseded where they differ. What was built:
>
> - **Look:** reference layout and style (serif display headline, rounded hero card on cream, tabbed planning card top-right, white journey rail bottom-left, materials card + stat + statement on a dark bottom band) in **Swapnobari brand colours** (navy instead of the reference brown, orange for the main CTA). Headline font: Instrument Serif (`font-display`); body Inter; headings Poppins.
> - **Logo/favicons:** real logo from `public/Swapnobari Home Logo transparent.png`, trimmed to `public/brand/logo.png`. `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png` copied from `public/favicon_io/`.
> - **Budget form removed from the hero** (the reference has no form). "Get Free Estimate" links to `/construction-budget`, where the form will live.
> - **No invented stats:** the reference's "140+ completed homes" and avatars are replaced by "A–Z house construction, one team" with the six journey-stage icons.
> - **Illustrations:** the floor plan (changes per tab: Plan / Vastu with N arrow and NE puja highlight / Build with columns and grid) and the cement/TMT/brick stack are inline SVG, because there are no photos for them.
> - **Mobile:** photo sits in the flow between the text and the cards; tab card hidden below 768 px; journey rail only at ≥ 1280 px; hamburger drawer below 1280 px.
> - **Deferred:** mobile sticky action bar and floating WhatsApp button (`DESIGN.md` §7.9), and the "Detect my location" budget form.

## Goal

Build the public site header (desktop + mobile) and the homepage hero with the "Know Your Construction Budget" card, pixel-faithful to `DESIGN.md`, as a UI-only preview the user can show the client.

## Why this runs before the admin panel

`AGENTS.md` says admin first. The user asked for this preview before any Supabase work so the client can approve the look. It is **UI only**: no database, no Server Actions, no real lead capture. It also lays the design-system foundation (tokens, fonts, buttons) that the admin panel will reuse.

## Read

- `AGENTS.md` §§1–8, 12–15
- `DESIGN.md` §2 (brand), §3 (colours), §4 (type), §5 (spacing/shadows), §6.1 (icons), §7.1 (buttons), §7.2 (form fields), §7.9 (floating/sticky), §8.1 (header), §8.2.1 (hero), §10 (responsive), §11 (accessibility), §14 (tokens)
- `PRD.md` §3, §5 items 1–2 and 12, §6.1
- `node_modules/next/dist/docs/01-app/01-getting-started/`: `03-layouts-and-pages.md`, `05-server-and-client-components.md`, `11-css.md`, `12-images.md`, `13-fonts.md`, `14-metadata-and-og-images.md`

## Code inspected

- `app/layout.tsx`: still Create Next App (Geist fonts, "Create Next App" metadata)
- `app/page.tsx`: starter page, to be replaced
- `app/globals.css`: shadcn neutral theme (oklch), `.dark` block, `--font-sans → --font-geist-sans`
- `components/ui/button.tsx`: shadcn `base-nova` on Base UI; sizes are small (h-8 default), no brand variants
- `public/`: only starter SVGs. **No logo, hero photo or mockup in the repo.**
- `lucide-react` icons verified: `BadgeIndianRupee`, `UserRoundCheck`, `Compass`, `HardHat`, `Users`, `Search`, `Menu`, `Phone`, `ArrowRight`, `MapPin`, `Ruler`, `Layers`, `User`, `Smartphone`, `CircleCheck`. Lucide has **no WhatsApp icon**.

## Decisions and assumptions (review these)

1. **Route group:** move the homepage to `app/(site)/page.tsx` with `app/(site)/layout.tsx` holding the header and mobile bottom bar. The root `app/layout.tsx` keeps only `<html>`, fonts and metadata. This is the structure `AGENTS.md` §7 prescribes.
2. **Logo:** none supplied. Use a text wordmark "Swapnobari" (Poppins 700, navy-700) with a Lucide `House` mark (2 px stroke, navy, orange accent) and the tagline "PLAN · VASTU · CONSTRUCT · BUILD BETTER" (small caps, letter-spaced). Swap for the real SVG later in one component.
3. **Hero photo:** none supplied. The hero shows the `DESIGN.md` light-blue-to-white gradient. If `public/images/hero-home.webp` is added, the right-side photo appears (one `next/image`, `priority`, 4:3). **Needs the user's photo or approval to use a licensed stock photo.**
4. **Contact details:** phone and WhatsApp number are unknown (open question §14.4). Put them in one file, `lib/site-config.ts`, as clearly marked placeholders (`+91 00000 00000`). The real values move to `site_settings` later.
5. **Nav links:** point to the real future paths (`/build-your-home`, `/construction-budget`, `/building-materials`, `/projects`, `/about`, `/contact`). Those pages show 404 until built. Active state uses the current pathname.
6. **Search icon:** visual only for now (button with `aria-label="Search"`, no behaviour).
7. **Budget form (preview behaviour):** client-side validation only (required fields, numeric size > 0, 10-digit mobile, consent ticked). On submit, the card is replaced by a success panel: "Thank you, {name}! Your estimate will be ready once we connect this form." plus a WhatsApp button. **No estimate number is shown**, because rates are not set (open question §14.2) and `AGENTS.md` forbids inventing them. Nothing is stored or sent.
8. **Location field:** a select with one option, "Silchar" (the launch city from the PRD). No invented areas. The "Use my current location" option is left out until the location data exists.
9. **Floors select:** options "Ground only (G)", "G+1", "G+2", "G+3", "G+4 or more".
10. **Consent:** include the consent checkbox ("I agree to be contacted by Swapnobari") even in the preview, since every real form needs it. The DESIGN mockup fields don't show it; it sits as a small line above the button.
11. **Dark mode:** remove the `.dark` theme block and the `dark` custom variant from `globals.css` (light theme only per `AGENTS.md`).
12. **Validation library:** none for this preview (native constraint validation + small TS checks). Zod comes with the Server Action in the backend phase.

## Files to create or modify

Create:

- `app/(site)/layout.tsx`: header + `<main>` + mobile bottom bar + desktop floating WhatsApp button
- `app/(site)/page.tsx`: homepage, renders `<Hero />` (other sections later)
- `components/site/site-header.tsx`: server component; logo, nav, search, Enquire Now
- `components/site/nav-links.tsx`: client; active-link underline (`usePathname`)
- `components/site/mobile-nav.tsx`: client; hamburger + Sheet drawer
- `components/site/mobile-action-bar.tsx`: sticky Call | WhatsApp | Get Estimate (mobile only)
- `components/site/whatsapp-float.tsx`: floating 56 px button (desktop only)
- `components/site/logo.tsx`
- `components/home/hero.tsx`: server; heading, subtext, trust icons, budget card slot
- `components/home/trust-icons.tsx`
- `components/home/budget-card.tsx`: client; form + success panel
- `components/icons/whatsapp.tsx`: inline SVG WhatsApp glyph (`currentColor`, `aria-hidden`)
- `lib/site-config.ts`: site name, tagline, nav items, placeholder phone/WhatsApp, `whatsappLink(message)` helper
- shadcn components via CLI: `input`, `label`, `select`, `sheet`, `checkbox`

Modify:

- `app/layout.tsx`: Poppins (600, 700) + Inter via `next/font/google` as CSS variables; metadata title "Swapnobari: Plan · Vastu · Construct · Build Better" and description from the PRD; `lang="en"`
- `app/globals.css`: Swapnobari tokens from `DESIGN.md` §14; map shadcn variables (`--primary` → orange-500, `--ring` → orange-500, `--foreground` → gray-800, `--border`/`--input` → gray-200, `--muted` → gray-50, `--secondary` → navy-50, `--radius` → 10 px); `--font-sans` → Inter, `--font-heading` → Poppins; remove `.dark` + `@custom-variant dark`
- `components/ui/button.tsx`: add brand variants `primary` (orange), `secondary` (white, navy border), `whatsapp` (green), `call` (white, gray-200 border) and size `brand` (48 px) / `brand-sm` (44 px), 10 px radius, 16 px semibold
- Delete `app/page.tsx` (replaced by `app/(site)/page.tsx`). Delete the unused starter SVGs in `public/`.

No new npm dependencies beyond the shadcn components' own.

## Implementation requirements

### Header (`DESIGN.md` §8.1)

- White, bottom border gray-200, sticky top, `shadow-sm` once scrolled (CSS-only where possible). Height 72 px desktop, 60 px mobile.
- Container max-width 1200 px, padding 24 px desktop / 16 px mobile.
- Desktop (≥1024 px): logo left; menu centre: Home | Build Your Home | Construction Budget | Building Materials | Our Projects | About Us | Contact (Inter 15 px, 500, navy-700; active item has a 2 px navy-700 underline, see note); right: search icon button (44 px target) + orange **Enquire Now** button with WhatsApp icon → opens `wa.me` with the pre-filled message "Hi Swapnobari, I want to know more about building my house." in a new tab.
  - Note: `DESIGN.md` says "active item navy with 2 px underline" and doesn't give the underline colour. Use **navy-700**, matching the text.
- Below 1024 px: logo left, hamburger right (`aria-label="Open menu"`). The Sheet opens from the right, full height: links (48 px rows), then Call (call variant) and WhatsApp (whatsapp variant) buttons at the bottom. Closes on link click and Esc; focus is trapped.

### Hero (`DESIGN.md` §8.2.1)

- Desktop ≈ 560 px tall, two columns (text ≈ 50%, card right ≈ 420–440 px wide). Background: soft gradient navy-50 → white, left to right; optional photo on the right behind/beside the card.
- H1 "Build Your Home With Clarity": Poppins 700, 48 px / 1.15 desktop, 32 px mobile, navy-700.
- Subtext "From Budget Planning to Vastu-Aligned Construction — Everything Under One Roof.": Inter 20 px / 1.5 desktop, 17 px mobile, gray-800.
- Trust icons row (5): Transparent Budget (`BadgeIndianRupee`), Expert Consultation (`UserRoundCheck`), Vastu Alignment (`Compass`), Quality Construction (`HardHat`), Trusted Network (`Users`). 40 px navy-700 line icons (1.75 stroke), two-line labels 14 px 500 navy-700, centred under each icon.
- Budget card: navy-700 background, 16 px radius, `shadow-lg`, 24–32 px padding. Title "Know Your Construction Budget" (white, Poppins 20 px 700); subtitle "Get an approximate cost for your house in minutes." (white/80%, 14 px).
  - Fields (white inputs, 48 px, 6 px radius, left icon 20 px gray-500, visible label via `sr-only` + placeholder per §7.2): Location (`MapPin`, select), Plot / house size in sq ft (`Ruler`, numeric), Number of floors (`Layers`, select), Your name (`User`), Mobile / WhatsApp (`Smartphone`, fixed `+91` prefix, `inputMode="numeric"`, `maxLength=10`).
  - Consent checkbox, 20 px, white text 13 px, "I agree to be contacted by Swapnobari".
  - Full-width orange **Get Estimate Now →** (48 px).
  - Caption "It's free and takes less than a minute." (white/70%, 13 px, centred).
  - Errors: red-tinted message under the field (`#FEE2E2` text on navy for contrast; verify ≥ 4.5:1), announced via `aria-live="polite"`, field gets `aria-invalid`.
  - Success panel replaces the form (decision 7): green check, "Thank you, {name}!", next-step line, WhatsApp button, "Edit details" link back to the form.
  - The card has `id="budget"` so "Get Estimate" buttons elsewhere scroll to it.
- Mobile (< 768 px) order: H1, subtext, budget card full width, trust icons as a 3 + 2 grid. Photo hidden.
- Tablet (768–1023 px): stack text then card (card max-width 520 px, centred).

### Mobile action bar and floating button (`DESIGN.md` §7.9)

- Mobile (< 768 px): fixed bottom bar, 64 px, white, top border gray-200, three equal buttons: **Call** (`tel:`), **WhatsApp** (green), **Get Estimate** (orange, scrolls to `#budget`). Add bottom padding to `<main>` so content isn't hidden. Respect `env(safe-area-inset-bottom)`.
- Desktop (≥ 768 px): floating WhatsApp button, bottom-right, 56 px circle, green-500, `shadow-lg`, `aria-label="Chat on WhatsApp"`. Hidden on mobile.

### Motion

- 150 ms hover transitions, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`; Sheet 200–250 ms. Disable non-essential motion under `prefers-reduced-motion`.

## Security requirements

- No secrets, env vars or network calls in this task.
- Placeholder phone/WhatsApp numbers live only in `lib/site-config.ts`, clearly marked `// PLACEHOLDER`.
- External links (`wa.me`) use `target="_blank" rel="noopener noreferrer"`.
- The form must not send data anywhere.

## Acceptance criteria

- [ ] `/` shows the new header and hero; no Create Next App content remains.
- [ ] Colours, fonts, sizes, radii and shadows match `DESIGN.md` tokens; no raw hex in components (tokens only).
- [ ] Desktop ≥ 1024 px: inline menu, search icon, orange Enquire Now with WhatsApp icon; active link underlined.
- [ ] < 1024 px: hamburger opens a drawer with all links + Call and WhatsApp; Esc and link click close it.
- [ ] At 360 px: no horizontal scroll; H1 32 px; card full width; trust icons 3 + 2; sticky bottom bar visible; floating button hidden.
- [ ] Budget form validates every field, shows accessible errors, and on valid submit shows the success panel without any estimate figure.
- [ ] Every interactive element is keyboard-reachable with a visible focus ring; all tap targets ≥ 44 px; icon-only buttons have `aria-label`.
- [ ] Green appears only on WhatsApp buttons; orange only on primary actions.
- [ ] Typecheck, lint and build pass.

## Checks to run

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (layout, routing and config change)

## Manual test steps (after implementation)

1. `npm run dev`, open http://localhost:3000.
2. Desktop (≥ 1280 px): compare header and hero against `DESIGN.md` §8.1 and §8.2.1; hover each nav item and button; Tab through the page and confirm the focus ring.
3. Click **Enquire Now**: WhatsApp opens in a new tab with the pre-filled message.
4. Submit the empty budget form: each field shows an error. Enter a 9-digit mobile: error. Fill everything validly and submit: success panel with your name; "Edit details" returns to the form.
5. DevTools device toolbar at 360 × 740: hamburger drawer works and closes on Esc; sticky bar shows Call | WhatsApp | Get Estimate; **Get Estimate** scrolls to the card; no horizontal scroll.
6. At 768 px and 1024 px: layout switches as described.
7. Enable "Emulate CSS prefers-reduced-motion: reduce" and confirm transitions are minimal.

## Needs the user's input

- Client mockup image: attach it if available, and it becomes the visual source of truth over this prompt.
- Logo (SVG preferred), or approve the text wordmark.
- Hero house photo, or approve sourcing a licensed stock photo (Indian / Northeast-style home).
