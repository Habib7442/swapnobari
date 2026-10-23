# Supabase setup (cost estimator and leads)

Project: **Swapno Bari**, region **South Asia (Mumbai) `ap-south-1`**, ref `rijrcxoqqibvwqnomrkh`.

## 1. Link the project and create the tables

From the project folder (you are already logged in with `npx supabase login`):

```bash
npx supabase link --project-ref rijrcxoqqibvwqnomrkh
npx supabase db push
```

- `link` asks for the **database password** you set when creating the project.
- `db push` runs `supabase/migrations/*.sql`: locations, estimator settings, site settings and leads, all with Row Level Security.

## 2. Load the starter data

Supabase dashboard → **SQL Editor** → **New query** → paste the contents of `supabase/seed.sql` → **Run**.

This adds Assam and Tripura with their district headquarters and major towns (Silchar first), the three packages (no rates), the stage split for the client to confirm, and settings (±10% range, 30-day duplicate window).

## 3. Add the client's rates (enables the instant estimate)

Until rates exist, the calculator saves the lead and tells the visitor the team will send the estimate. To show instant figures, run (replace the numbers with the client's real rates per sq ft of built-up area):

```sql
insert into public.budget_rates (city_id, package_id, rate_per_sqft)
select c.id, p.id, v.rate
from (values ('basic', 0), ('standard', 0), ('premium', 0)) as v(slug, rate)
join public.budget_packages p on p.slug = v.slug
cross join public.cities c
where c.slug = 'silchar'
on conflict (city_id, package_id) do update set rate_per_sqft = excluded.rate_per_sqft;
```

(`rate_per_sqft` must be greater than 0, so the template's zeros fail on purpose until real numbers are entered.)

Changes appear on the site within about 5 minutes (cache). To change a rate later: **Table Editor → budget_rates** → edit the row.

### Optional client data

- **Areas** (adds an area dropdown): Table Editor → `areas` → Insert row (city = Silchar, name, slug, PIN).
- **Package contents** (adds the "What's included" table): Table Editor → `budget_package_features` (package, label such as "Cement", value such as "Brand A / Brand B", sort).
- **Stage split**: Table Editor → `budget_stages`. Percentages must total 100, or the breakdown is hidden.

## 4. Regenerate TypeScript types after schema changes

```bash
npx supabase gen types typescript --linked > lib/supabase/types.ts
```

## 5. Environment variables

Local: `.env.local`. Production: Vercel → Project → Settings → Environment Variables. The full list is in `.env.example`.

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → API Keys → Publishable key |
| `SUPABASE_SECRET_KEY` | Supabase → API Keys → Secret key (never share) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile → your widget |
| `IP_HASH_SALT` | Any long random string (already generated in `.env.local`; reuse the same value on Vercel) |
| `RESEND_API_KEY` | resend.com → API Keys |
| `LEAD_ALERT_EMAIL` | Inbox(es) for new leads, comma-separated |
| `LEAD_ALERT_FROM` | e.g. `Swapnobari Leads <leads@swapnobari.in>` (domain verified in Resend) |

Without Turnstile keys the bot check is skipped (with a server warning); without Resend keys leads are still saved but no email is sent. Set both before going live.

## 6. Viewing leads (until the admin panel exists)

Supabase → **Table Editor → leads**. Each budget lead has `ref_code` (e.g. `SB-000001`), contact details, the estimate snapshot in `details`, and `result_token`; the visitor's estimate page is `https://swapnobari.in/construction-budget/estimate/<result_token>`.
