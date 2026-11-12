# Home: Shubh Nirman Sanskar™ band polish

## Goal

Give the homepage Sanskar band a finished, premium journey layout (filled marigold stage circles with dashed connectors on desktop, a 3 + 3 grid on tablet, a dashed vertical timeline on mobile), with an optional decorative image slot, and make the How It Works connector visible.

## Read

- `AGENTS.md` (all), especially §4 (no "Book a Puja", "™"), §6, §12
- `DESIGN.md` §3.2, §4 (Sanskar title), §6.1, §6.2, §8.6 (homepage band), §10, §11, §12
- `prompts/home-how-it-works-polish.md` (connector geometry being touched)
- No new Next.js APIs. `next/image` used as elsewhere.

## Existing code inspected

- `components/home/sanskar-band.tsx`: header row with title, subtitle, quote with left border; `<ol>` of six stages (white circle + marigold ring, brown icon, 1px brown dashed connectors); explanation + orange WhatsApp CTA "Ask About Shubh Nirman Sanskar"
- `lib/content/home.ts`: `SANSKAR_STAGES` (`name`, `icon`; no description field), marked interim until admin module 14
- `app/globals.css`: all five `sanskar-*` tokens exist; `--font-sanskar` → Playfair Display (loaded in `app/layout.tsx`)
- `public/images/`: **no `sanskar/` folder, so `kalash.webp` does not exist today**
- `components/home/how-it-works.tsx` (connector line classes)

## Decisions and assumptions

1. **Decorative image switch is a constant, not a runtime file check.** `SANSKAR_BAND_IMAGE` in `lib/content/home.ts` is `null` today. When `public/images/sanskar/kalash.webp` is added, set it to that path. Reason: the home page is prerendered and revalidated on the server, and a filesystem check for `public/` files is not reliable inside Vercel functions; it could make the image appear and disappear between renders. With `null`, nothing renders and the content is not shifted.
2. **Title weight 700** per DESIGN §4 (currently 600), Playfair (`font-sanskar`), 28 px mobile / 40 px lg. Subtitle stays sanskar-brown.
3. **Optional stage description:** add `description?: string` to `SanskarStage`. No descriptions are added now (copy unchanged), so none render today.
4. **Contrast on cream (measured):** sanskar-brown 9.39:1, brown at 80% 5.41:1, maroon 8.39:1, maroon icon on the 15% marigold circle 7.65:1. All pass 4.5:1.
5. **Stage name alignment:** centred at md+ (under the circle). On the mobile timeline it is left-aligned beside the circle, since a centred label next to a left circle reads poorly.
6. **CTA unchanged** (label, WhatsApp link, orange style). The explanation + CTA block becomes centred at every width (currently left-aligned below lg), per item 6.
7. **How It Works:** only the dashed connector's colour changes, `border-gray-200` → `border-gray-500/40`. The mobile solid timeline line is not "the dashed connector", so it stays gray-200.

## Files

Modify:

- `components/home/sanskar-band.tsx`
- `lib/content/home.ts` (`description?` on `SanskarStage`, `SANSKAR_BAND_IMAGE`)
- `components/home/how-it-works.tsx` (one class)
- `components/site/section.tsx` (optional `decoration` prop, see Implementation)

No new files, no new dependencies, no data/RLS/migration changes.

## Implementation

**Band:** `Section background="sanskar-cream"`. The image must reach the band's left edge, but `Section` puts children inside the container, so `Section` gets an optional `decoration?: ReactNode` prop, rendered before the container inside the `<section>` (which becomes `relative overflow-hidden`). Backward-compatible; other sections pass nothing. If `SANSKAR_BAND_IMAGE`:

- Decoration: `absolute inset-y-0 left-0 hidden w-[18%] lg:block`, `next/image` `fill`, `object-cover`, `alt=""`, `sizes="18vw"`, lazy (default), with `[mask-image:linear-gradient(to_right,black_55%,transparent)]` so it fades into the cream.
- Content gets `lg:pl-[16%]` only when the image exists.

**Header row:** `flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12`.

- `h2` `font-sanskar text-[28px] lg:text-[40px] leading-[1.2] font-bold text-sanskar-maroon`, "Shubh Nirman Sanskar™".
- Subtitle `text-base sm:text-lg text-sanskar-brown`.
- Quote: unchanged (italic serif, thin left divider `border-sanskar-brown/30`).

**Stages:** `<ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-6 lg:gap-4">`.

Each `<li>`: `relative flex items-start gap-4 md:flex-col md:items-center md:gap-3 md:text-center`.

- Circle: `size-16` (64 px), `rounded-full`, `bg-sanskar-marigold/15`, `border-2 border-sanskar-marigold`, icon `size-7` (28 px) `text-sanskar-maroon` `strokeWidth={1.75}`, `aria-hidden` on the icon.
- Text block `min-w-0 pt-3 md:pt-0`:
  - Name: `text-[15px] leading-snug font-semibold text-sanskar-brown line-clamp-2 md:min-h-[2lh]`.
  - Description (only if present): `mt-1 text-sm text-sanskar-brown/80`, one line on desktop (`lg:line-clamp-1`).
- **Desktop connector** (lg, not after the last stage), `aria-hidden`, `absolute top-6 hidden items-center lg:flex`, from `left-[calc(50%+38px)]` (circle edge 32 + 6 px) with `w-[calc(100%-60px)]` (column + 16 px gap − 76 px), so it ends 6 px before the next circle: a `flex-1 border-t-2 border-dashed border-sanskar-marigold/60` line, then `ChevronRight` `size-4 shrink-0 -ml-1 text-sanskar-marigold`.
- **Mobile line** (< md, not after the last), `aria-hidden`, `absolute left-[31px] top-[70px] bottom-[-18px] border-l-2 border-dashed border-sanskar-marigold/60 md:hidden` (from 6 px under the circle to 6 px above the next across the 24 px gap).

**Explanation + CTA:** `mt-10 flex flex-col items-center gap-5 text-center`; paragraph and CTA unchanged.

**How It Works fix:** in the lg connector, `border-gray-200` → `border-gray-500/40`.

## Security

Static content only; no inputs, data or routes. The CTA keeps `rel="noopener noreferrer"`.

## Acceptance criteria

- [ ] Band on sanskar-cream; with `SANSKAR_BAND_IMAGE = null` no image markup renders and nothing is offset.
- [ ] With an image path set: left 18% decorative image at lg+, full band height, faded right, `alt=""`, lazy; content shifted right; hidden below lg.
- [ ] Title Playfair 700, maroon, 28/40 px, with "™"; subtitle brown; quote and divider unchanged.
- [ ] lg: six equal columns; 64 px circles (marigold 15% fill, 2 px marigold border, 28 px maroon icon); names 15/600 brown, centred, two-line height, never more than two lines.
- [ ] lg: five dashed marigold connectors with a chevron, circle edge to circle edge, `aria-hidden`.
- [ ] md: 3 + 3 grid, no connectors.
- [ ] Mobile: circles on the left joined by a dashed marigold line, none after Griha Pravesh; names fully visible at 360.
- [ ] Explanation and the unchanged orange CTA centred under the stages.
- [ ] `<ol>`/`<li>` markup. No "Book a Puja" anywhere. Tokens only, Lucide only, no emoji.
- [ ] How It Works: dashed connector visibly gray-500/40; nothing else changed there.
- [ ] No horizontal page scroll at 360, 768, 1024, 1280, 1440.

## Checks

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual test

1. `npm run dev`, open `/`, scroll to the Sanskar band.
2. At 1440, 1280, 1024: header (title + subtitle left, quote right with divider); six stages in a row; connectors start and end just off the circle edges, chevron before each next circle, none after the last; all stage names occupy the same height.
3. At 768: 3 + 3 grid, centred names, no connectors.
4. At 360: vertical timeline; the dashed line runs from under each circle to just above the next, none after Griha Pravesh; the long names wrap within two lines, nothing clipped.
5. The CTA opens WhatsApp with the existing Sanskar message.
6. Temporarily set `SANSKAR_BAND_IMAGE` to any existing image (e.g. `/images/materials-tmt.webp`) and check the left image, fade and content shift at lg+, and that it is hidden at 768; set it back to `null`.
7. Scroll to How It Works at 1280: the dashed connectors are now clearly visible.
