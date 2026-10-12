# Swapnobari: Product Requirements Document (Version 1)

| | |
|---|---|
| **Product** | Swapnobari (স্বপ্নবাড়ি, "dream home") |
| **Domain** | swapnobari.in |
| **Document version** | 1.0 (draft for client review) |
| **Date** | 12 October 2026 |
| **Launch region** | Silchar, Assam (expandable to Barak Valley, Tripura and beyond) |
| **Build order** | Admin panel first, then the public website |

---

## 1. Overview

### 1.1 What Swapnobari is
Swapnobari helps people build a house from start to finish: budget, planning, Vastu, construction and handover. It also helps them find building-material sellers near them. The website must be **simple, clean and mobile-friendly**. A visitor should understand in a few seconds that Swapnobari helps them from **planning a house to complete construction**, and that they can also find cement and TMT sellers.

### 1.2 Positioning
**PLAN → VASTU ALIGN → BUILD → MATERIALS → SHUBH NIRMAN → HANDOVER**

### 1.3 Version 1 goals
1. Capture qualified leads (house construction, consultation, planning, Vastu, plan review, Shubh Nirman Sanskar, material enquiries).
2. Send every lead to the admin panel, with a WhatsApp notification where possible.
3. List approved cement and TMT dealers by location.
4. Earn from advertising slots for cement and TMT brands, managed from the admin panel.
5. Keep the backend expandable for more cities, material categories, dealer subscriptions, paid listings and project tracking.

### 1.4 Out of scope for Version 1
- Online payments and online material ordering
- Dealer subscriptions and paid listing plans (data model must allow them later)
- Customer accounts and customer project-tracking app
- Professional (mistri, contractor) marketplace
- Mobile apps

---

## 2. Users and roles

| Role | Who | What they can do |
|---|---|---|
| **Visitor / customer** | Homeowner or plot owner | Browse, submit enquiries, find dealers, call or WhatsApp dealers |
| **Dealer / seller** | Cement and TMT shop owner | Submit "List Your Store" form; listing visible only after admin approval |
| **Advertiser** | Cement or TMT brand | No login in V1; banners are managed by admin |
| **Super Admin** | Owner | Everything, including users, settings and deletions |
| **Admin / manager** | Office staff | Manage leads, dealers, prices, banners, content (no user management) |
| **Lead executive** | Telecaller or sales | View and update leads assigned to them; cannot export or delete |

City-scoped access (a manager who sees only their city) must be possible in the data model, even if V1 has one city.

---

## 3. Brand and visual design

### 3.1 Colours (from client reference)
| Use | Colour | Hex (starting point) |
|---|---|---|
| Primary (header text, headings, dark bands, footer CTA) | Deep navy | `#13294B` |
| Accent (main buttons: Get Estimate, Search Sellers, Enquire) | Orange | `#F26B1D` |
| Background | White / light blue-grey | `#FFFFFF` / `#F3F6FA` |
| Card border | Light grey-blue | `#E2E8F0` |
| WhatsApp buttons | Green | `#25A244` |
| Shubh Nirman Sanskar band | Warm cream background, maroon heading, marigold accents | `#FFF4E5` / `#8B1E1E` / `#F5A623` |
| Body text | Charcoal | `#1F2937` |

Final hex values to be confirmed against the logo.

### 3.2 Style rules
- Clean white sections with rounded cards and real photography (houses, plans, materials).
- Orange only for primary actions; navy for structure; green only for WhatsApp.
- Every advertisement clearly labelled **"Advertisement"** or **"Sponsored"**.
- Mobile first: sticky bottom bar on mobile with **Call**, **WhatsApp** and **Get Estimate**.
- Fonts: one clean sans-serif family (e.g. Poppins or Plus Jakarta Sans for headings, Inter or DM Sans for body).

---

## 4. Site map

**Main menu:** Home | Build Your Home | Construction Budget | Building Materials | Our Projects | About Us | Contact

| Page | Purpose |
|---|---|
| Home | Overview, budget form, services, materials search, how it works, Shubh Nirman Sanskar, projects, feedback, CTA |
| Build Your Home | The six services in detail, each with its own enquiry form |
| Construction Budget | Full budget estimator plus lead capture |
| Building Materials | Location + material search, dealer listings, today's price CTA, ads |
| Dealer profile | Single dealer page (name, location, brands, Call, WhatsApp, Get Price) |
| List Your Store / Become a Seller | Dealer registration form |
| Today's Cement & TMT Price | Indicative prices by city and brand, with enquiry |
| Shubh Nirman Sanskar | Dedicated page explaining the ritual journey |
| Our Projects | Gallery of completed and ongoing projects |
| About Us | Company story and team |
| Contact | Contact form, phone, WhatsApp, address, map |
| Privacy Policy, Terms | Legal pages |

---

## 5. Homepage specification

Sections in order:

1. **Header:** logo (Swapnobari, tagline "Plan · Vastu · Construct · Build Better"), main menu, search icon, orange **Enquire Now** button (opens WhatsApp or the enquiry form).
2. **Hero:**
   - Headline: "Build Your Home With Clarity"
   - Subtext: "From Budget Planning to Vastu-Aligned Construction — Everything Under One Roof."
   - Trust icons: Transparent Budget, Expert Consultation, Vastu Alignment, Quality Construction, Trusted Network.
   - Right side: **Know Your Construction Budget** form (see 6.1).
3. **Quick flow strip:** Build a House | Know Construction Cost | Plan My House | Vastu Alignment | Find Cement/TMT Seller (each links to the right page or form).
4. **Our Services:** six cards with image, title, one line, button (see 6.2).
5. **Advertisement banner** (full width, admin-managed, labelled "Advertisement").
6. **Find Building Materials Near You:** material tabs, location + optional brand, Search Sellers, featured sellers, side ad (see section 7). Plus the CTA **"Check / Get Today's Cement & TMT Price"**.
7. **How It Works:** Share Requirement → Consultation → Budget & Plan → Construction → Handover.
8. **Shubh Nirman Sanskar™ band** (see section 8).
9. **Our Projects** (4–5 cards) and **Client Feedback** carousel.
10. **Main CTA band:** "Planning to Build a House? Talk to Us Before You Start." with **Enquire Now on WhatsApp**.
11. **Footer:** menu links, services, contact details, social links, legal links.
12. **Floating WhatsApp button** on every page.

---

## 6. Services and lead forms

### 6.1 Know Your House Construction Budget
**Fields:** Location (city/area, with "Detect my location"), Plot / house size (sq ft), Number of floors, Name, Mobile / WhatsApp. Optional: finish level (Basic / Standard / Premium).

**Logic:**
`estimate = built-up area × floors × rate(city, finish level)`
- Rates per city and finish level are set by admin.
- Show a **range** (e.g. ±10%, admin-configurable), never a single exact figure.
- Disclaimer: "Approximate estimate. Final cost depends on design, site and materials."
- Result is shown after the form is submitted, so every estimate is a lead.

**Open point:** does "plot size" mean land area or built-up area? The formula needs built-up area (see section 15).

### 6.2 The six services
Each card opens a short enquiry form (or a page with the form) and creates a lead with that service type.

| # | Service | Button | Extra fields beyond the standard set |
|---|---|---|---|
| 1 | House Construction Budget Estimate | Get Budget Estimate | Same as 6.1 |
| 2 | Pre-Construction Consultation | Book Consultation | Preferred date/time, plot owned (Y/N) |
| 3 | Floor Plan & Architectural Planning | Get House Plan | Plot size, plot facing, number of rooms |
| 4 | Vastu-Aligned Home Planning | Know More | Plot facing, existing plan (Y/N) |
| 5 | Complete A–Z House Construction | Start Your Project | Plot size, floors, budget range, start timeline |
| 6 | Plan / Estimate Review | Upload for Review | File upload (PDF/JPG/PNG, max size set by admin), what to review |

### 6.3 Standard lead fields (every enquiry)
Name, Mobile/WhatsApp, Location, Requirement (service type), approximate area and/or budget where relevant, source page, consent checkbox ("I agree to be contacted by Swapnobari").

Captured automatically: date and time, page and button clicked, UTM/campaign source, device type.

### 6.4 After submission
- Thank-you message with what happens next ("Our team will contact you within [X] hours").
- Option: "Chat on WhatsApp now" (pre-filled message containing the lead ID).
- Admin notification (see section 10).

---

## 7. Building materials and dealers

### 7.1 Find Building Materials Near You
- **Materials in V1:** Cement, TMT / Rod. Categories are data, so Bricks, Sand & Stone, Tiles, Electrical and Plumbing can be switched on later from admin without code changes.
- **Search:** select location + material (+ optional brand) → list of approved dealers serving that area, featured or sponsored first.
- **Empty result:** "No sellers listed here yet. Tell us what you need and we'll arrange a quote," which creates a material lead.

### 7.2 Dealer card / profile
Dealer name, location (area, city), brands available, photo or logo, and three buttons:
- **Call**
- **WhatsApp** (pre-filled: "Hi, I found you on Swapnobari. I need a price for [material] in [area].")
- **Get Price / Enquiry** (form: name, mobile, material, brand, quantity, delivery location → creates a lead linked to the dealer)

Optional badges: Verified, Featured, Sponsored.

**Tracking:** every Call and WhatsApp click is logged against the dealer (date, material, location). This proves value to dealers and supports paid listings later. See 15 for the decision on whether dealer numbers are shown directly.

### 7.3 Today's Cement & TMT Price
- Page and CTA: **"Check / Get Today's Cement & TMT Price."**
- Table by city: material, brand, indicative price, unit, last updated date.
- Prices entered by admin (or later by dealers, subject to approval).
- Button "Get exact price from sellers near me" → price enquiry lead.
- Label: "Indicative prices. Actual price may vary by dealer and quantity."

### 7.4 List Your Store / Become a Seller
**Form fields:** business name, owner name, mobile, WhatsApp, email (optional), address, city, area/PIN, service areas, materials sold, brands available, GST number (optional), shop photo/logo upload, consent.

**Flow:** submit → status **Pending** → admin reviews → **Approved** (visible) or **Rejected** (with reason). The dealer is notified on WhatsApp or SMS.

---

## 8. Shubh Nirman Sanskar™

### 8.1 Homepage band
- Title: **Shubh Nirman Sanskar™**
- Subtitle: "Auspicious Beginnings at Every Important Stage of Your Home"
- Quote: "A home is not built in one day. Its auspicious journey shouldn't be limited to one ritual."
- Horizontal journey (vertical on mobile), each stage with an illustrated icon:
  1. Bhumi Shuddhi & Ishan Pujan
  2. Griharambha & Neev Sthapan
  3. Pratham Dhalai Sanskar
  4. Mukhya Dwaar Sthapan
  5. Vastu Shanti & Pujan
  6. Griha Pravesh
- Text: "From the first prayer on your land to the day you enter your completed home, we can coordinate traditional rituals at important construction milestones."
- Button: **Explore Shubh Nirman Sanskar →**

### 8.2 Dedicated page
- A short explanation of each of the six stages (when it happens in construction and its significance).
- What Swapnobari coordinates:
  ✓ Muhurta Guidance ✓ Purohit Coordination ✓ Puja Samagri Arrangement ✓ Construction-stage Coordination ✓ Vastu Guidance at Key Stages
- CTA: **"Planning to Start Construction? Know Your First Auspicious Step →"** → form (name, mobile, location, construction stage, planned start month) → lead type "Shubh Nirman Sanskar".

**Positioning rule:** never present this as "Book a Puja". It is always part of the home-building journey.

**Note:** "™" can be used for an unregistered mark in India; "®" only after registration. Recommend the client file a trademark application.

---

## 9. Advertisement system

- **Slots in V1:** Homepage full-width banner; Homepage materials side banner; Building Materials page top banner and side banner. Slots are defined as data, so new ones can be added.
- **Per banner (admin):** advertiser/brand name, desktop image, mobile image, link URL, slot, cities where shown, start and end date, priority, active/paused, label ("Advertisement" or "Sponsored").
- **Rotation:** if several banners share a slot, rotate by priority or randomly.
- **Tracking:** impressions and clicks per banner, with a date-range report the client can share with advertisers.
- **Sponsored dealers:** admin can mark a dealer as Featured/Sponsored for a date range; they appear first and carry the label.
- Every paid placement must show the label. No hidden advertising.

---

## 10. Lead management and WhatsApp

### 10.1 Lead types
Budget Estimate, Consultation, Floor Plan, Vastu, A–Z Construction, Plan/Estimate Review, Shubh Nirman Sanskar, Material Price Enquiry, Dealer Enquiry, General Contact, Dealer Registration (handled in the dealer module).

### 10.2 Lead record
Lead ID, type, name, mobile, location, requirement details, area/budget, files, source page, UTM, linked dealer (if any), status, assigned to, follow-up date, notes history, created/updated time.

### 10.3 Statuses (to confirm with client)
New → Contacted → Consultation Scheduled → Quoted → Won / Lost (with reason) / Not Reachable / Duplicate.

### 10.4 Rules
- Duplicate detection: same mobile number within [X] days is flagged and linked.
- Every status change and note is recorded with user and time.
- Export to Excel/CSV (Super Admin and Admin only).

### 10.5 WhatsApp
- **V1 (free):** click-to-chat links with pre-filled messages on every WhatsApp button; floating WhatsApp button.
- **New-lead alert:** email to admin (free). WhatsApp alert to admin via WhatsApp Business API if the client approves the running cost.
- **Later:** automatic WhatsApp confirmation to the customer and to the dealer for dealer enquiries (needs the Business API and approved message templates).

---

## 11. Admin panel (built first)

| # | Module | Key functions |
|---|---|---|
| 1 | **Login & security** | Email + password, 2-factor for admins, password reset, session timeout |
| 2 | **Dashboard** | New leads today/week, leads by type and city, pending dealer approvals, top ad clicks, follow-ups due today |
| 3 | **Leads** | List with filters (type, status, city, date, assigned), lead detail, status change, notes, follow-up date, assign, WhatsApp/Call shortcut, export |
| 4 | **Locations** | State → City → Area → PIN; active / coming soon; used by all forms and searches |
| 5 | **Services** | Edit the six service cards (title, text, image, button, form fields on/off, order) |
| 6 | **Budget calculator settings** | Rates per city and finish level, range %, disclaimer text |
| 7 | **Material categories** | Add, enable or disable categories (Cement, TMT now; others later), icon, order |
| 8 | **Brands** | Brand list per category (UltraTech, ACC, Tata Tiscon, JSW, etc.) with logo |
| 9 | **Dealers** | Pending / approved / rejected lists, approve or reject with reason, edit profile, service areas, materials, brands, Featured/Sponsored dates, click stats |
| 10 | **Today's prices** | Price per city × material × brand × unit, last-updated date, bulk edit, history |
| 11 | **Advertisements** | Slots, banners (images, link, cities, dates, priority, label), impressions and clicks report |
| 12 | **Projects** | Gallery items: title, type, city, status (completed/ongoing), photos, featured on homepage |
| 13 | **Testimonials** | Add, approve, hide, order; name, city, photo, rating, text |
| 14 | **Shubh Nirman Sanskar content** | Edit stage names, icons, descriptions and page text |
| 15 | **Site settings** | Phone, WhatsApp number(s), email, address, social links, homepage banner text, SEO titles |
| 16 | **Users & roles** | Add users, assign role, optional city scope, deactivate |
| 17 | **Activity log** | Who changed what and when, including dealer approvals and lead exports |

Admin panel must work on mobile, so staff can update leads from their phones.

---

## 12. Data model (high level)

All location-dependent records link to the location hierarchy, so a new city is added from admin with no code change.

- `states`, `cities`, `areas` (with PIN codes, active flag)
- `services`, `service_form_fields`
- `budget_rates` (city, finish level, rate per sq ft)
- `material_categories`, `brands`
- `dealers` (status, profile), `dealer_service_areas`, `dealer_materials`, `dealer_brands`
- `prices` (city, category, brand, unit, price, updated_at), `price_history`
- `ad_slots`, `ads`, `ad_events` (impression/click)
- `leads`, `lead_notes`, `lead_status_history`, `lead_files`
- `dealer_contact_events` (call / WhatsApp clicks)
- `projects`, `project_images`, `testimonials`
- `sanskar_stages`, `site_settings`
- `users`, `roles`, `activity_log`

**Ready for later (fields reserved now, unused in V1):** dealer `plan` and `plan_expiry` (subscriptions), `is_paid_listing`, `projects.customer_id` and `project_stages` (project tracking).

---

## 13. Technology

| Layer | Choice |
|---|---|
| Website and admin | Next.js (TypeScript), server-rendered for SEO |
| Database, auth, file storage | Supabase (PostgreSQL), Mumbai region |
| Hosting | Vercel (Pro for commercial use) with Cloudflare DNS |
| Email | Resend or Brevo (lead alerts) |
| WhatsApp | Click-to-chat in V1; WhatsApp Business API optional |
| SMS / OTP | MSG91 or 2Factor (optional, DLT registration required) |
| Maps / location | Browser geolocation (free); Google Maps only if map display is needed |
| Analytics | Google Analytics 4 and Google Search Console |

**Security requirements:**
- Row Level Security on every table.
- Lead and dealer contact data readable only by authorised admin roles.
- Server-side validation on all forms.
- Spam protection on public forms (Cloudflare Turnstile or OTP) plus rate limiting.
- File uploads limited by type and size.
- Daily backups.
- HTTPS everywhere.
- Consent checkbox on forms (DPDP Act).

---

## 14. Non-functional requirements

- **Mobile first:** all pages usable at 360 px width; tap targets at least 44 px.
- **Performance:** homepage loads in under 3 seconds on a 4G connection; images compressed (WebP) and lazy-loaded.
- **SEO:** a page per service and per city; meta titles and descriptions editable in admin; sitemap.xml; structured data for local business.
- **Language:** English in V1; structure ready for Bengali/Hindi later.
- **Accessibility:** readable contrast, labelled form fields, keyboard-usable forms.
- **Availability:** hosted on managed cloud with uptime monitoring.

---

## 15. Open questions for the client

1. **Dealer phone numbers:** the brief asks for **Call** and **WhatsApp** buttons on seller profiles. Should dealer numbers be dialled directly (simplest; we log the click), or should calls go through Swapnobari first (enquiry form, then we connect), so every material lead is captured?
2. **Budget form:** is "plot size" the land area or the house built-up area? Do we show finish levels (Basic / Standard / Premium)? What are the per-sq-ft rates for Silchar?
3. **Launch locations:** which city and areas/PIN codes at launch?
4. **WhatsApp:** which number receives enquiries? Free click-to-chat only, or the paid Business API for automatic alerts?
5. **OTP:** should customers verify their mobile number by OTP before submitting?
6. **Lead statuses and team:** confirm the stages in 10.3 and who will use the admin panel.
7. **Prices:** who updates today's cement and TMT prices, and how often?
8. **Advertising:** confirm slot positions and sizes; is pricing for advertisers needed in V1?
9. **Shubh Nirman Sanskar:** do they have purohits and samagri partners ready? Is it a paid service, and should a price be shown?
10. **Content:** who provides project photos, testimonials, dealer data, logo and About Us text?
11. **Legal:** do they have a privacy policy and terms? Is the Swapnobari trademark being filed?

---

## 16. Delivery plan (indicative)

| Phase | Scope | Duration |
|---|---|---|
| 0 | Final PRD sign-off, answers to section 15, design approval | 1 week |
| 1 | **Admin panel:** auth, roles, locations, services, calculator settings, materials, brands, dealers, prices, ads, leads, content modules | 4–5 weeks |
| 2 | **Public website:** all pages, forms, materials search, dealer profiles, ads, Shubh Nirman Sanskar page | 3–4 weeks |
| 3 | Testing, data entry for launch city, SEO setup, go-live | 1–2 weeks |

**Total: about 9–12 weeks** after sign-off.

---

## 17. Acceptance criteria (V1)

- [ ] Every form on the site creates a lead visible in the admin panel within seconds, with correct type, location and source.
- [ ] Admin receives a new-lead notification (email at minimum).
- [ ] Budget form shows an estimate range using admin-set rates for the selected city.
- [ ] A customer can select location + Cement or TMT and see only approved dealers serving that area.
- [ ] Dealer cards show name, location, brands, Call, WhatsApp and Get Price; clicks are logged.
- [ ] A new dealer registration stays hidden until an admin approves it.
- [ ] Admin can add, schedule and remove banners without a developer; every paid banner shows "Advertisement" or "Sponsored".
- [ ] Admin can add a new material category and a new city, and both appear on the website without code changes.
- [ ] Today's price page shows admin-entered prices with a last-updated date.
- [ ] Shubh Nirman Sanskar band and page display all six stages, and the CTA creates a lead.
- [ ] All pages work on mobile, with a floating WhatsApp button.
- [ ] Lead executives see only their assigned leads and cannot export data.

---

## 18. Future roadmap (after V1)

- More material categories (bricks, sand, tiles, electrical, plumbing)
- More cities and states
- Dealer logins to update their own prices and stock
- Dealer subscriptions and paid listing plans, with online payment (Razorpay)
- WhatsApp Business API automation
- Customer project tracking (stages, photos, payments)
- Professional marketplace (contractors, mistris, architects)
- Bengali and Hindi versions
- Mobile app