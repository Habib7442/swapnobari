# Swapnobari: Design Document (Version 1)

| | |
|---|---|
| **Product** | Swapnobari (স্বপ্নবাড়ি, "dream home") |
| **Domain** | swapnobari.in |
| **Companion doc** | PRD.md (features and rules); this file covers look, layout and components |
| **Visual reference** | Client homepage mockup (navy + orange, white cards, Shubh Nirman Sanskar band) |
| **Date** | 12 October 2026 |

---

## 1. Design principles

1. **Clarity first.** A visitor should understand in five seconds: "They help me plan and build my house, and find cement/TMT sellers."
2. **Calm and trustworthy.** Lots of white space, real photos, honest labels. No flashing, no clutter, no fake urgency.
3. **One obvious next step.** Every section ends with one clear button. Orange always means "the main action".
4. **Mobile first.** Most visitors arrive on a phone, often from WhatsApp. Design at 360 px first, then scale up.
5. **Honest advertising.** Ads look like ads and always carry an "Advertisement" or "Sponsored" label.
6. **Culturally warm.** The Shubh Nirman Sanskar section uses warm, auspicious colours and motifs, but stays tasteful and premium.

---

## 2. Brand

### 2.1 Name and logo
- Wordmark: **Swapnobari**, set in the heading font, Bold.
- Symbol: simple line house / roof mark (outline, 2–2.5 px stroke), in navy with an orange or green accent stroke.
- Tagline under the wordmark (small caps, letter-spaced): **PLAN · VASTU · CONSTRUCT · BUILD BETTER**
- Variants needed: horizontal (header), stacked (footer, social), icon only (favicon, app icon), white version (dark backgrounds).
- Minimum size: 120 px wide for the horizontal logo; clear space = height of the house symbol on all sides.

### 2.2 Voice
- Simple English, short sentences, reassuring tone.
- Talk about the customer's home, not about us: "Know your budget before you start", not "We provide estimation services".
- Avoid jargon (write "built-up area" with a hint, not "BUA").
- Indian number format: ₹12,50,000 or ₹12.5 lakh.

---

## 3. Colour system

### 3.1 Core palette
| Token | Hex | Use |
|---|---|---|
| `navy-900` | `#0E1F3A` | Footer CTA band, dark text on light |
| `navy-700` | `#13294B` | **Primary**: headings, logo, header text, budget card background |
| `navy-500` | `#2B4A7A` | Secondary text links, icons |
| `navy-50` | `#EEF3FA` | Light tinted sections, selected tab background |
| `orange-600` | `#E35A0F` | Orange button hover/pressed |
| `orange-500` | `#F26B1D` | **Accent**: primary buttons (Get Estimate, Search Sellers, Enquire Now) |
| `orange-50` | `#FFF1E8` | Light orange highlights, active chips |
| `green-600` | `#1E8A3A` | WhatsApp button hover |
| `green-500` | `#25A244` | **WhatsApp only** |
| `white` | `#FFFFFF` | Page and card background |
| `gray-50` | `#F5F7FA` | Alternate section background |
| `gray-200` | `#E2E8F0` | Card borders, dividers, input borders |
| `gray-500` | `#64748B` | Secondary text, captions (on white only) |
| `gray-800` | `#1F2937` | Body text |

### 3.2 Shubh Nirman Sanskar palette
| Token | Hex | Use |
|---|---|---|
| `sanskar-cream` | `#FFF4E5` | Band background |
| `sanskar-maroon` | `#8B1E1E` | Title "Shubh Nirman Sanskar™" |
| `sanskar-marigold` | `#F5A623` | Icon circles, connecting arrows |
| `sanskar-leaf` | `#4F7A28` | Leaf / nature accents |
| `sanskar-brown` | `#5A3A1E` | Stage labels and body text in the band |

### 3.3 Step colours (How It Works)
Five numbered circles, each a different calm colour: `#E85D5D` (1), `#3B82F6` (2), `#22A55B` (3), `#F59E0B` (4), `#8B5CF6` (5). White numbers. Labels stay navy so readability doesn't depend on colour.

### 3.4 Status colours (admin and forms)
| Status | Text | Background |
|---|---|---|
| Success / Approved / Won | `#166534` | `#DCFCE7` |
| Warning / Pending | `#92400E` | `#FEF3C7` |
| Error / Rejected / Lost | `#991B1B` | `#FEE2E2` |
| Info / New | `#1E40AF` | `#DBEAFE` |
| Neutral / Closed | `#374151` | `#F3F4F6` |

### 3.5 Usage rules
- Ratio: about 70% white/gray-50, 20% navy, 10% orange and green.
- Orange is for primary buttons and small highlights only, never for large backgrounds (except the dedicated CTA button).
- Green is only for WhatsApp. Never use green for other buttons.
- Text contrast: at least 4.5:1. White text only on `navy-700`, `navy-900`, `orange-600` or darker, `green-600`.
- On `orange-500` buttons, use **white Bold 16 px or larger** text (meets 3:1 large-text contrast), or switch to `orange-600` for smaller text.

---

## 4. Typography

| Role | Font | Weight | Desktop | Mobile | Line height |
|---|---|---|---|---|---|
| Display (hero H1) | Poppins | 700 | 48 px | 32 px | 1.15 |
| H2 (section titles) | Poppins | 700 | 32 px | 24 px | 1.25 |
| H3 (card titles) | Poppins | 600 | 18 px | 17 px | 1.3 |
| Body large (hero subtext) | Inter | 400 | 20 px | 17 px | 1.5 |
| Body | Inter | 400 | 16 px | 15 px | 1.6 |
| Small / captions | Inter | 400 | 14 px | 13 px | 1.5 |
| Button | Inter | 600 | 16 px | 16 px | 1 |
| Label (form) | Inter | 500 | 14 px | 14 px | 1.4 |
| Sanskar title | Playfair Display (or Cormorant Garamond) | 700 | 40 px | 28 px | 1.2 |

- Load from Google Fonts with `display=swap`; subset Latin only in V1.
- Rupee symbol: use the `₹` character (Inter supports it).
- Future Bengali support: Noto Sans Bengali / Hind Siliguri.

---

## 5. Spacing, grid and shape

- **Base unit:** 4 px. Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.
- **Container:** max-width 1200 px, side padding 24 px desktop / 16 px mobile.
- **Grid:** 12 columns, 24 px gutter (desktop); 4 columns, 16 px gutter (mobile).
- **Section spacing:** 64–80 px top/bottom desktop, 40–48 px mobile.
- **Radius:** 6 px inputs and small buttons, 10 px buttons, 12 px cards, 16 px large panels and banners, full pill for chips.
- **Shadows:**
  - `shadow-sm`: `0 1px 2px rgba(15,31,58,0.06)` (cards at rest)
  - `shadow-md`: `0 6px 18px rgba(15,31,58,0.10)` (card hover, dropdowns)
  - `shadow-lg`: `0 16px 40px rgba(15,31,58,0.16)` (modals, hero form card)
- **Breakpoints:** `sm` 480, `md` 768, `lg` 1024, `xl` 1280.

---

## 6. Iconography and imagery

### 6.1 Icons
- Line icons (Lucide or Phosphor), 1.75–2 px stroke, rounded joins.
- Sizes: 16 (inline), 20 (inputs, buttons), 24 (feature lists), 40–48 (trust icons, steps).
- Trust icons in the hero sit in navy line style: Transparent Budget (₹ shield), Expert Consultation (house with person), Vastu Alignment (compass), Quality Construction (helmet), Trusted Network (people).
- Material tabs: Cement (bag), TMT/Rod (bars), Bricks, Sand & Stone, Tiles, Electrical, Plumbing.
- Sanskar stages: custom illustrated icons in marigold circles (leaf, bricks, slab/mixer, door, diya, house). Warm, flat, consistent stroke.
- Never use emoji in the interface.

### 6.2 Photography
- Real or high-quality photos of **Indian / Northeast-style homes**: 2–3 storey houses, daylight or golden hour, greenery.
- Service cards: calculator + model house, consultation over plans, 3D floor plan, Vastu compass on plan, house under construction, magnifier on drawings.
- Materials: clean product shots on white (cement bags, TMT bundles).
- People: real local team where possible; workers in clean safety gear.
- Ratio: hero 4:3, service cards 16:10, project cards 4:3, dealer thumbnails 1:1.
- Format: WebP, max 200 KB per card image, 400 KB for hero; always lazy-load below the fold.
- Avoid: obvious stock-photo clichés, Western suburban houses, AI images with distorted details.

---

## 7. Components

### 7.1 Buttons
| Variant | Style | Use |
|---|---|---|
| **Primary** | `orange-500` background, white text, 10 px radius, 48 px height (44 px small) | Get Estimate Now, Search Sellers, Enquire Now, Get Price |
| **Secondary** | White background, 1 px `navy-700` border, navy text | Book Consultation, Get House Plan, View more |
| **WhatsApp** | `green-500` background, white text, WhatsApp icon left | WhatsApp, Enquire Now on WhatsApp |
| **Call** | White background, 1 px `gray-200` border, navy text, phone icon | Call (dealer cards) |
| **Ghost / link** | Navy text with → arrow, underline on hover | View All Sellers →, View All Projects → |

States: hover darkens 1 step and lifts `shadow-sm`; pressed darkens 2 steps; focus shows a 3 px `orange-50` ring plus a 2 px `orange-500` outline; disabled 40% opacity, no shadow; loading shows a spinner and keeps width.

### 7.2 Form fields
- Height 48 px, 1 px `gray-200` border, 6 px radius, white background, left icon (20 px, `gray-500`).
- Label above (14 px, 500) or placeholder-style inside the hero form (keep a visible label for accessibility via floating label or `aria-label`).
- Focus: `navy-500` border + soft ring. Error: red border, message under the field in `#991B1B` with icon.
- Mobile number field: fixed `+91` prefix, numeric keypad (`inputmode="numeric"`), 10-digit validation.
- Location field: dropdown with search (City → Area), plus "Use my current location" option at the top.
- Consent checkbox: 20 px box, small text with link to the privacy policy.

### 7.3 Cards
- **Service card:** image (16:10) top, title (H3, navy), one-line description (gray-500), secondary button full width at bottom. 12 px radius, `gray-200` border, `shadow-sm`; hover lifts with `shadow-md` and zooms the image 3%.
- **Dealer card:** 1:1 thumbnail left, name (600), location with pin icon, "Brands:" line; row of three buttons: Call, WhatsApp, Get Price. Optional badges top-right: Verified (blue), Featured (navy), Sponsored (gray with label).
- **Project card:** 4:3 photo, title (600), location (gray-500). Status pill "Ongoing" when relevant.
- **Testimonial card:** quote icon, text (16 px), avatar, name, city, 5 stars (`#F59E0B`).

### 7.4 Material tabs and chips
- Pill chips with icon + label, 40 px high, white background, `gray-200` border.
- Active: `navy-700` background, white text and icon.
- On mobile, chips scroll horizontally (no wrapping) with a fade on the right edge.

### 7.5 Ad banner
- Fixed aspect slots (see 9.3). 16 px radius, overflow hidden.
- Small label top-right: "Advertisement" or "Sponsored", 11 px, uppercase, white text on `rgba(0,0,0,0.45)` pill.
- Click opens the advertiser URL in a new tab.
- Placeholder when empty: light gray box with "Advertise here: contact us" (links to Contact page), not an empty gap.

### 7.6 Steps (How It Works)
- Five items in a row with → arrows between them; each: coloured number circle (44 px), title (600), one-line description.
- Mobile: vertical list with a thin connecting line on the left.

### 7.7 Modals and drawers
- Enquiry forms opened from service cards appear as a **centered modal** on desktop (max 520 px) and a **bottom sheet** on mobile.
- Close icon top-right (44 px tap target), Esc closes, focus is trapped inside.

### 7.8 Toasts and confirmations
- Success after submission: full panel replaces the form with a green check, "Thank you, [Name]!", what happens next, and a WhatsApp button.
- Errors: inline under the field, plus a short top message if the server fails ("Something went wrong. Please try again or WhatsApp us.").

### 7.9 Floating and sticky elements
- **Desktop:** floating WhatsApp button, bottom-right, 56 px circle, `green-500`, shadow-lg.
- **Mobile:** sticky bottom bar (64 px) with three equal buttons: **Call** | **WhatsApp** | **Get Estimate** (orange). The floating button is hidden on mobile to avoid duplication.

---

## 8. Website page layouts

### 8.1 Header
- Height 72 px desktop, 60 px mobile; white; bottom border `gray-200`; sticky on scroll with `shadow-sm`.
- Left: logo. Centre: menu (Home | Build Your Home | Construction Budget | Building Materials | Our Projects | About Us | Contact), 15 px, 500; active item navy with 2 px underline. Right: search icon, orange **Enquire Now** button with WhatsApp icon.
- Mobile: logo left, hamburger right; menu opens as a full-height drawer with links, then Call and WhatsApp buttons at the bottom.

### 8.2 Homepage (desktop, top to bottom)

**1. Hero (approx. 560 px tall)**
- Background: soft light-blue-to-white gradient on the left, large house photo blending in on the right.
- Left column (≈ 50%): H1 "Build Your Home With Clarity" (navy); subtext "From Budget Planning to Vastu-Aligned Construction — Everything Under One Roof."; row of five trust icons with two-line labels.
- Right column: **budget card** on `navy-700`, 16 px radius, shadow-lg. Title "Know Your Construction Budget" (white, 20 px, 700), subtitle "Get an approximate cost for your house in minutes." Fields (white inputs): Location, Plot / house size (sq ft), Number of floors, Your name, Mobile / WhatsApp. Full-width orange **Get Estimate Now →**. Caption "It's free and takes less than a minute."
- Mobile: H1, subtext, then the budget card full width, then trust icons as a 3+2 grid. The photo moves behind the heading at reduced height (220 px) or is hidden.

**2. Quick flow strip**
- Thin band of five linked pills: Build a House · Know Construction Cost · Plan My House · Vastu Alignment · Find Cement/TMT Seller. Horizontal scroll on mobile.

**3. Our Services**
- H2 "Our Services", subtitle "Simple Solutions for Your Home Construction Journey".
- Six service cards in one row on desktop (6 columns ≥ 1280 px; 3 × 2 at 1024 px; 2 × 3 at 768 px; horizontal swipe carousel with peek on mobile).

**4. Advertisement banner (homepage, full width)**
- Inside the container, 1200 × 160 desktop, 360 × 120 mobile. Label "Advertisement".

**5. Find Building Materials Near You**
- Left (≈ 75%): H2, subtitle "Cement, TMT/Rod and more from trusted local sellers."; material chips; search row: location dropdown | brand (optional) | orange **Search Sellers**. Below: "Featured Sellers in Your Area" + "View All Sellers →"; four dealer cards in a row (2 × 2 tablet, stacked on mobile).
- Right (≈ 25%): vertical ad slot 300 × 400 with "Advertisement".
- Below: full-width outline banner/CTA **"Check / Get Today's Cement & TMT Price →"**.

**6. How It Works**
- H2 "How It Works", subtitle "A simple and transparent process from your first enquiry to handover." Five steps.

**7. Shubh Nirman Sanskar™ band** (see section 8.6)

**8. Our Projects + Client Feedback**
- Two-column on desktop: left (≈ 70%) "Our Projects" with five project cards in a row and "View All Projects →"; right (≈ 30%) "Client Feedback" carousel with arrows.
- Mobile: projects as swipe carousel, then feedback.

**9. Main CTA band**
- Full width, `navy-900` background, house icon left, title "Planning to Build a House?" (white, 28 px), line "Talk to Us Before You Start. Get the right plan, budget and Vastu guidance." Right: orange **Enquire Now on WhatsApp →** button (WhatsApp icon).

**10. Footer**
- `navy-900` or white (decide in design review; recommend white with navy text to stay light).
- Columns: logo + short line + social icons | Quick Links | Services | Building Materials | Contact (phone, WhatsApp, email, address). Bottom row: © 2026 Swapnobari, Privacy, Terms.

### 8.3 Build Your Home
- Page hero (compact, 280 px): title, one line, breadcrumb.
- Six services as alternating image-left / image-right blocks: title, 3–4 benefit bullets, "What you get", button opening the matching enquiry modal.
- Sticky side or bottom CTA "Talk to us before you start".

### 8.4 Construction Budget
- Two columns: left the full form (same fields as hero, plus finish level selector Basic / Standard / Premium as three selectable cards); right "How we calculate" explainer and disclaimer.
- Result state: large navy card "Estimated cost: ₹XX – ₹YY lakh", line "for [area] sq ft, [floors], [city]", buttons **Get Detailed Quote** (orange) and **Discuss on WhatsApp** (green).

### 8.5 Building Materials
- Top ad banner (1200 × 160).
- Search panel (material chips, location, brand, Search).
- Results: list of dealer cards (one column on mobile, two columns desktop) with filter sidebar on desktop (brand, area) and sort (Featured first, nearest area).
- Right rail ad 300 × 600 on desktop.
- Today's Cement & TMT Price block: table with City, Material, Brand, Price, Unit, Updated; on mobile, each row becomes a card.
- Bottom CTA: "Are you a dealer? **List Your Store** →".

**Dealer profile page:** header with photo/logo, name, location, badges; brands as logo chips; materials; service areas; large buttons Call / WhatsApp / Get Price; map (optional, later).

### 8.6 Shubh Nirman Sanskar
**Homepage band**
- Background `sanskar-cream` with a decorative brass kalash / marigold photo on the left edge (cropped, ≈ 20% width, hidden on mobile).
- Title "Shubh Nirman Sanskar™" in the serif font, `sanskar-maroon`; subtitle "Auspicious Beginnings at Every Important Stage of Your Home". Quote on the right, italic serif, with a thin vertical divider.
- Six stages in a row: marigold icon circle (64 px), stage name (600, brown), one-line description; dashed arrows between. Mobile: vertical timeline.
- Under the journey: one line of explanation and an orange **Explore Shubh Nirman Sanskar →** button.

**Dedicated page**
- Hero: warm photo (diya / kalash on a construction site or new home), title, quote.
- Six stage blocks as a vertical timeline: number, icon, stage name, "When: [construction milestone]", 2–3 line description.
- "What we coordinate" grid of five tiles with check icons: Muhurta Guidance, Purohit Coordination, Puja Samagri Arrangement, Construction-stage Coordination, Vastu Guidance at Key Stages.
- Final CTA card: "Planning to Start Construction?" + orange **Know Your First Auspicious Step →** opening the form.
- Tone: respectful, warm, premium. No "Book a Puja" language anywhere.

### 8.7 List Your Store / Become a Seller
- Benefits strip (3 items): Get local customers, Free listing in V1, Get enquiries on WhatsApp.
- Form in a single column (max 640 px) split into steps on mobile: 1 Business details → 2 Materials & brands (checkbox chips) → 3 Photos & submit.
- After submit: "Thank you! Our team will review your listing within [X] working days."

### 8.8 Our Projects, About Us, Contact
- **Projects:** filter chips (All, Completed, Ongoing, by city), 3-column grid, project detail page with photo gallery and key facts (type, size, location, status).
- **About Us:** story, mission line, values (four icons), team photos, service area map image.
- **Contact:** two columns: contact form | phone, WhatsApp, email, address, office hours, embedded map.

---

## 9. Advertisement slot specifications

| Slot ID | Page | Desktop size | Mobile size | Notes |
|---|---|---|---|---|
| `home_banner` | Home, after services | 1200 × 160 | 360 × 120 | Full width in container |
| `home_materials_side` | Home, materials section | 300 × 400 | Hidden or 360 × 120 below results | |
| `materials_top` | Building Materials | 1200 × 160 | 360 × 120 | |
| `materials_side` | Building Materials | 300 × 600 | 360 × 120 between results | |

- Admin uploads separate desktop and mobile images (PNG/JPG/WebP, max 300 KB).
- Safe zone: keep text 24 px away from edges; the label sits top-right, so avoid placing key content there.
- Provide advertisers with a one-page spec sheet using this table.

---

## 10. Responsive behaviour summary

| Element | Desktop | Mobile |
|---|---|---|
| Navigation | Inline menu + Enquire button | Hamburger drawer + sticky bottom bar |
| Hero | Text left, budget card right | Text, then budget card full width |
| Services | 6 across | Swipe carousel |
| Material chips | Wrap in one row | Horizontal scroll |
| Dealer cards | 4 across (home) / 2 columns (materials page) | Stacked, buttons full width row |
| How it works | Horizontal with arrows | Vertical timeline |
| Sanskar journey | Horizontal with arrows | Vertical timeline |
| Tables (prices, admin) | Table | Cards per row |
| Forms | Modal | Bottom sheet |

---

## 11. Accessibility checklist

- Text contrast ≥ 4.5:1 (≥ 3:1 for 24 px+ or 18.5 px+ Bold).
- All tap targets ≥ 44 × 44 px.
- Every input has a label (visible or `aria-label`); errors are announced (`aria-live`).
- Icon-only buttons (search, menu, close, WhatsApp float) have `aria-label`.
- Keyboard: all interactive elements reachable by Tab, visible focus ring, Esc closes modals.
- Images have meaningful `alt` text; decorative images use empty `alt`.
- Colour is never the only signal (status pills include text; step circles include numbers).
- Respect `prefers-reduced-motion`: disable carousel auto-play and hover zooms.

---

## 12. Motion

- Durations: 150 ms (hover), 200–250 ms (modals, drawers), 300 ms (section fade-in).
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Allowed: card lift on hover, gentle fade-up of sections on first view, carousel slide.
- Not allowed: auto-playing video with sound, parallax-heavy effects, blinking or bouncing buttons.
- Testimonial carousel: auto-advance every 6 s, pauses on hover/touch.

---

## 13. Admin panel design

### 13.1 Look and feel
- Same brand, calmer: white and `gray-50` surfaces, navy for structure, orange only for the main action on each screen ("Add Dealer", "Save").
- Font sizes one step smaller (body 14 px, tables 14 px).
- Works on mobile (staff update leads from phones).

### 13.2 Layout
- **Left sidebar** (240 px, `navy-900`, white text; collapses to 72 px icons; becomes a drawer on mobile):
  Dashboard · Leads · Dealers · Today's Prices · Advertisements · Locations · Services · Budget Settings · Materials & Brands · Projects · Testimonials · Shubh Nirman Content · Users · Activity Log · Settings.
  Badges show counts (new leads, pending dealers).
- **Top bar** (64 px, white): page title, global search (lead by name/mobile), city selector (for future multi-city), notifications bell, user menu.
- **Content area:** max-width 1400 px, 24 px padding.

### 13.3 Key screens
**Dashboard**
- Row of four stat cards: New leads today, Leads this week, Pending dealer approvals, Follow-ups due today.
- Chart: leads per day (last 30 days), split by type.
- Lists: latest 10 leads; dealers awaiting approval; top ads by clicks this week.

**Leads list**
- Filter bar: search, type, status, city/area, assigned to, date range; saved filter tabs (All, New, My leads, Follow-up today).
- Table columns: Lead ID, Name, Mobile, Type, Location, Status (pill), Assigned, Created, Follow-up. Row actions: WhatsApp, Call, Open.
- Bulk actions: assign, change status, export (role-permitted).
- Mobile: each lead as a card with name, type, status pill and quick WhatsApp/Call buttons.

**Lead detail** (right-side drawer on desktop, full page on mobile)
- Header: name, mobile with Call/WhatsApp buttons, status dropdown, assigned-to dropdown.
- Sections: requirement details, files (preview/download), source (page, UTM), linked dealer.
- Timeline: notes and status changes with user and time; "Add note" box with follow-up date picker.

**Dealers**
- Tabs: Pending (count) · Approved · Rejected.
- Pending row expands to show all submitted details and photos, with **Approve** (green) and **Reject** (opens reason field).
- Dealer edit form: profile, service areas (multi-select), materials, brands, Featured/Sponsored toggle with date range, stats (calls, WhatsApp clicks, enquiries).

**Today's Prices**
- Spreadsheet-style editable grid: rows = brand, columns = city (or filter by city), cells = price; unit per category; "last updated" per cell; Save all.

**Advertisements**
- Slot list with current live banner thumbnails.
- Banner form: advertiser, slot, desktop + mobile image upload with live preview inside the slot frame, link, cities, start/end dates, priority, label (Advertisement / Sponsored), status.
- Report: impressions, clicks, CTR per banner and date range; Download CSV.

**Locations**
- Tree view: State › City › Area, with PIN codes; toggle Active / Coming soon; add and rename inline.

**Budget Settings**
- Table: city × finish level → rate per sq ft; range % field; disclaimer text; live preview of the estimate for a sample input.

**Content screens** (Services, Projects, Testimonials, Shubh Nirman)
- List with drag-to-reorder, visible/hidden toggle, edit form with image upload and live card preview.

### 13.4 Admin components
- Tables: 48 px rows, sticky header, zebra off, row hover `gray-50`, pagination 25/50/100.
- Status pills: section 3.4 colours, 12 px, 600, rounded.
- Empty states: icon, one line, primary action ("No leads yet. Share your website link to start getting enquiries.").
- Confirmations for destructive actions (delete, reject) in a modal with the item name.
- Save feedback: toast top-right ("Dealer approved").

---

## 14. Design tokens (for developers)

```css
:root {
  /* colour */
  --navy-900:#0E1F3A; --navy-700:#13294B; --navy-500:#2B4A7A; --navy-50:#EEF3FA;
  --orange-600:#E35A0F; --orange-500:#F26B1D; --orange-50:#FFF1E8;
  --green-600:#1E8A3A; --green-500:#25A244;
  --white:#FFFFFF; --gray-50:#F5F7FA; --gray-200:#E2E8F0; --gray-500:#64748B; --gray-800:#1F2937;
  --sanskar-cream:#FFF4E5; --sanskar-maroon:#8B1E1E; --sanskar-marigold:#F5A623;
  --sanskar-leaf:#4F7A28; --sanskar-brown:#5A3A1E;

  /* type */
  --font-heading:'Poppins', system-ui, sans-serif;
  --font-body:'Inter', system-ui, sans-serif;
  --font-sanskar:'Playfair Display', Georgia, serif;

  /* radius */
  --radius-sm:6px; --radius-md:10px; --radius-lg:12px; --radius-xl:16px; --radius-pill:999px;

  /* shadow */
  --shadow-sm:0 1px 2px rgba(15,31,58,.06);
  --shadow-md:0 6px 18px rgba(15,31,58,.10);
  --shadow-lg:0 16px 40px rgba(15,31,58,.16);

  /* layout */
  --container:1200px; --gutter:24px;
}
```

Implementation: Tailwind CSS with these tokens in `tailwind.config`, and shadcn/ui components (Button, Input, Select, Dialog, Sheet, Table, Tabs, Badge, Toast) restyled to match.

---

## 15. Assets checklist (from client)

- [ ] Logo files (SVG preferred), or approval to design one
- [ ] Hero photo(s) of a finished home
- [ ] Six service images (or approval to source licensed stock)
- [ ] Project photos with title, location and status
- [ ] Testimonials with name, city, photo (with permission)
- [ ] Dealer list with names, locations, brands, photos
- [ ] Sanskar section imagery (kalash, diya, marigold) or approval to illustrate
- [ ] Advertiser banners in the slot sizes (section 9)
- [ ] Contact details: phone, WhatsApp number, email, office address

---

## 16. Design deliverables and order

1. Logo and brand sheet (colours, fonts, logo variants)
2. **Admin panel screens** (built first): dashboard, leads list + detail, dealers, prices, ads, locations, budget settings
3. Homepage (desktop + mobile)
4. Building Materials page + dealer profile
5. Construction Budget page (form + result)
6. Shubh Nirman Sanskar page
7. Build Your Home, List Your Store, Projects, About, Contact
8. Component library page (buttons, inputs, cards, pills, modals) for developer handover