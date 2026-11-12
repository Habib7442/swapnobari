# Home: "How It Works" polish

## Goal

Turn the boxed step list into an open, colour-coded five-step process: filled step circles with connectors on desktop, a 3 + 2 grid on tablet and a vertical timeline on mobile.

## Read

- `AGENTS.md` (all), especially §6 (UI rules) and §12
- `DESIGN.md` §3.3, §3.5, §7.6, §10, §11, §12
- No new Next.js APIs are used (a plain client component for the reveal).

## Existing code inspected

- `components/home/how-it-works.tsx` (steps array inline, white card wrapper, tinted outline circles, navy numbers)
- `components/site/section.tsx`, `section-header.tsx`
- `app/globals.css`: `--color-step-coral|blue|green|amber|violet` **already exist** in `@theme` with the DESIGN §3.3 values; `--animate-fade-up` and the `prefers-reduced-motion` override already exist
- `components/home/hero.tsx` (existing `animate-fade-up` + `[animation-delay:…]` pattern)

## Decisions and assumptions

1. **Tokens:** the five step colours are already tokens (`step-coral`, `step-blue`, `step-green`, `step-amber`, `step-violet`), so nothing new is added to `globals.css`. The component maps each step to its token classes; no hex values in the component.
2. **Copy and step data unchanged.** The steps stay in the component (they are not in `lib/content/home.ts` today); only the colour field changes from a tint string to a `{ fill, ring }` class pair.
3. **Contrast (decided: tinted fill).** DESIGN §3.5/§11 want 4.5:1 for 16 px text. On the solid DESIGN §3.3 fills no single number colour passes all five: white measures coral 3.41, blue 3.68, green 3.18, amber 2.15, violet 4.23; navy-900 measures 4.82, 4.48, 5.17, 7.66, 3.89. So every circle uses a **15% tint of its step colour** (`bg-step-*/15`, composited on gray-50) with a **solid 2 px ring of the step colour** and a **navy-900 number**: coral 12.99, blue 13.00, green 13.16, amber 13.78, violet 12.81. Same treatment on all five steps; no per-step exception.
4. **Description colour:** gray-500 on the gray-50 background measures 4.43:1, just under 4.5, and DESIGN §3.1 says gray-500 is "on white only". **Default: gray-600** (7.04:1), same size and weight. Say if you want gray-500 exactly.
5. **Connector visibility:** a 1 px dashed gray-200 line on gray-50 is very faint by design; the gray-500 chevron carries the direction. Built as specified.
6. **Fade-up without hiding content:** a small client wrapper (`components/site/reveal-list.tsx`) renders the steps visible on the server. After hydration, only if the list is still below the viewport and the user has not asked for reduced motion, it marks the list "pending" (steps at opacity 0) and plays `animate-fade-up` with a 60 ms stagger when 20% of it enters view, once. No JS or reduced motion = steps simply visible. Duration uses the existing `fade-up` keyframes (600 ms, matching the hero).
7. **Breakpoints:** mobile < 768 timeline; md 768–1023 `grid-cols-3` (3 + 2, left-aligned, no connectors); lg ≥ 1024 five equal columns with connectors.

## Files

Modify:

- `components/home/how-it-works.tsx`

Create:

- `components/site/reveal-list.tsx` (client: IntersectionObserver reveal for an `<ol>`)

No new dependencies. No data, RLS or migration changes.

## Implementation

**Wrapper:** remove the white card (`rounded-2xl border bg-white p-* shadow`). The `<ol>` sits on the section's gray-50, `mt-10`.

**List:** `<ol>` with one `<li>` per step (native ordered-list semantics, so screen readers announce position "1 of 5"). Grid: `grid gap-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-5 lg:gap-6`.

**Step (`li`):** `relative flex gap-4 md:flex-col md:gap-4`, text left-aligned.

- Circle: `size-11` (44 px), `rounded-full`, `bg-step-*/15`, `ring-2 ring-step-*`, navy-900 number `text-base font-bold` (decision 3), `aria-hidden="true"` (the list already gives the position; the visible number stays for sighted users).
- Title: `h3`, 16 px, 600, navy-700, `leading-snug`.
- Description: 14 px, `leading-relaxed`, gray-600 (decision 4), `line-clamp-3`, `mt-1`.

**Desktop connector (lg+, not after step 5):** `aria-hidden` absolutely positioned row, `top-[14px]`, from `left-14` (circle 44 + ring 2 + 10 px gap) to `-right-4` (ends 4 px before the next circle's ring across the 24 px gap), `hidden lg:flex items-center`: a `flex-1 border-t border-dashed border-gray-200` line, then `ChevronRight` 16 px gray-500 (`-ml-1`, `shrink-0`).

**Mobile timeline (< md, not after step 5):** `aria-hidden` 2 px line `bg-gray-200`, `left-[21px]`, from `top-[52px]` (below circle + ring + 4 px) to `bottom-[-24px]` (stops 4 px above the next ring across the 32 px gap), `md:hidden`.

**Reveal:** `<RevealList>` renders the `<ol>`; children carry `style={{ animationDelay: index * 60ms }}` and classes that apply `opacity-0` only while the list has `data-reveal="pending"` and `animate-fade-up` when `data-reveal="in"`. Global reduced-motion CSS already disables the animation; the component also skips the pending state under reduced motion.

## Security

Static content only. No inputs, data or routes.

## Acceptance criteria

- [ ] No white card; steps sit on gray-50.
- [ ] 44 px circles with a 15% tint of each step colour and a solid 2 px ring of that colour; navy-900 bold numbers.
- [ ] Every step number measures at least 4.5:1 against its circle (computed on gray-50), all five steps checked.
- [ ] Title 16/600 navy-700; description 14 px, max 3 lines; all left-aligned under the circle (md+) or beside it (mobile).
- [ ] lg+: five equal columns; four dashed connectors with a chevron, from one circle's right to just before the next.
- [ ] md: 3 + 2 grid, no connectors.
- [ ] Mobile: circles down the left joined by a 2 px gray-200 line, none after step 5.
- [ ] `<ol>`/`<li>` markup; connectors and lines `aria-hidden`.
- [ ] Fade-up once on first view, staggered 60 ms; none with reduced motion or without JS; content never hidden for no-JS users.
- [ ] Tokens only; no clipped text at 360; no horizontal page scroll at 360, 768, 1024, 1280, 1440.

## Checks

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual test

1. `npm run dev`, open `/`, scroll to "How It Works" slowly: the steps fade up one after another, once.
2. Reload while already scrolled to the section: steps are visible immediately, no flash.
3. With OS "reduce motion" on: no animation, steps visible.
4. At 1440, 1280 and 1024: five columns; each connector starts just right of a circle's ring and its chevron sits just before the next circle; no connector after Handover.
5. At 768: three steps on the first row, two on the second, left-aligned, no connectors.
6. At 360: vertical timeline, the line joins circle centres and stops after step 4; descriptions are not clipped.
7. Screen reader (Narrator/NVDA): list announced with five items, "1 of 5" etc.
