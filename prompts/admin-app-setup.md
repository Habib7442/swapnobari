# Admin app setup: separate Next.js app, login and security, app shell

## Goal

Create the Swapnobari admin panel as a separate Next.js app at `E:\Web Dev\swapnobari-admin`, where the client signs in securely (email + password + TOTP 2FA), lands in the branded admin shell, and from which every later module (leads, dealers, prices, content…) will be built. The admin repo becomes the owner of the Supabase schema.

## Read

- `AGENTS.md` §1, §2, §6, §7, §8, §9, §10, §11, §12, §15
- `PRD.md` §2 (roles), §11 (admin modules: this task is module 1 + shell), §12 (data model)
- `DESIGN.md` §3.4, §13.1, §13.2, §13.4, §14
- Next.js 16 local docs: `02-guides/authentication-with-cache-components.md`, `03-api-reference/03-file-conventions/proxy.md`, `03-api-reference/04-functions/revalidateTag.md`, `updateTag.md`

## Existing code inspected

- `swapnobari/supabase/` (config.toml, 2 migrations, seed.sql): locations, budget tables, `site_settings`, `leads` (leads have no anon/authenticated access; server writes only).
- `swapnobari/lib/supabase/{admin,public,types}.ts`, `lib/constants.ts`, `lib/domain/phone.ts`, `lib/data/estimator.ts` (uses `cacheTag(ESTIMATOR_CACHE_TAG)`).
- `swapnobari/app/globals.css` (tokens in `@theme`), `components.json` (`base-nova`), `components/ui/{button,dropdown-menu,sheet}.tsx`.
- `swapnobari/package.json`: Next 16.4.2, React 19.3.0, Tailwind 4, Zod 4, supabase-js 2.
- Your other admin apps (`whitehill-lifecare-admin` etc.) are on the same Next 16.4.2 / React 19.3 / Tailwind 4 stack but do not use Supabase, so nothing is copied from them.

## Decisions (confirmed with you)

1. **Separate app**: `E:\Web Dev\swapnobari-admin`, its own git repo (branch `main`, no remote yet). Overrides AGENTS.md §7 "`app/admin/`". AGENTS.md in both repos is updated to say so.
2. **Users**: V1 has only the client, with full access (`super_admin`). The `profiles.role` column still allows `super_admin | admin | lead_executive` and `city_id` scope, so staff can be added later with no schema rework. No staff roles, user management screens or per-role UI in this task.
3. **Migrations live in the admin repo.** `swapnobari/supabase/` moves to `swapnobari-admin/supabase/`. The public site keeps only `lib/supabase/types.ts`, regenerated from the shared project.
4. **Domain**: decided later. Built and tested locally on `http://localhost:3001`. Admin is `noindex` and `robots.txt` disallows everything regardless.

## Decisions (mine, please check)

5. **No public sign-up.** The client's account is created once (Supabase dashboard → Authentication → Add user, or the CLI command in Test step 2) and promoted to `super_admin` by SQL. A user with no `profiles` row, or `is_active = false`, cannot enter the admin even with a valid password.
6. **2FA is required** for every admin user: first login forces TOTP enrolment (QR code + manual secret, any authenticator app: Google Authenticator, Microsoft Authenticator, 1Password). Every later login asks for the 6-digit code. Uses Supabase Auth MFA (`aal2`); no extra package (Supabase returns the QR as SVG).
7. **Session timeout**: signed out after **60 minutes idle** or **12 hours** total, whichever comes first. Implemented in the app with a signed `sb_admin_activity` cookie checked in `proxy.ts` and on the server. Values in `lib/constants.ts`.
8. **Admin data access uses the signed-in user's session** (`@supabase/ssr`, publishable key) so RLS applies. The secret key is used only for a few things RLS cannot cover (later modules, e.g. reading `leads` before staff policies exist), always after `requireAdmin()`.
9. **Public site cache refresh**: the public site gets `POST /api/revalidate` (Bearer `REVALIDATE_SECRET`, Zod-validated body `{ tags: string[] }` limited to an allow-list in `lib/constants.ts`), which calls `revalidateTag(tag, { expire: 0 })`. The admin gets `lib/revalidate-public.ts` to call it. Nothing calls it yet; the first content module (Budget Settings) will. Built now so the contract is fixed once.
10. **Shared code is copied, not linked**: `lib/constants.ts` (lead types, statuses), `lib/domain/phone.ts`, the design tokens and `components/ui/*` are copied into the admin app. Each copied file starts with a one-line comment naming its twin in the other repo. A monorepo was rejected.
11. **Public repo changes go on a new branch** `chore/admin-split` cut from `feat/cost-estimator`, so the estimator PR stays reviewable on its own.
12. **Port**: admin `npm run dev` runs on **3001** so both apps run side by side.

## New dependencies (admin app)

- `@supabase/ssr`: cookie-based Supabase Auth sessions in Next.js (required for login).
- Everything else matches the public site: `next@16.4.2`, `react@19.3.0`, `@supabase/supabase-js`, `zod`, `lucide-react`, `@base-ui/react` via shadcn, `tailwindcss@4`, `vitest`.
- shadcn components added with `npx shadcn@latest add`: `button input label input-otp sheet dropdown-menu sonner`. Some may pull extra packages (e.g. `input-otp`); I will list them in the closing note.

## Files

### New repo `E:\Web Dev\swapnobari-admin`

Scaffold with `create-next-app` (TypeScript, App Router, Tailwind, ESLint, no `src/`), then pin versions to the public site.

```
AGENTS.md                     admin operating manual (derived from swapnobari/AGENTS.md, admin-only rules)
CLAUDE.md                     @AGENTS.md
.env.example
next.config.ts                cacheComponents: true; security headers; X-Robots-Tag: noindex
proxy.ts                      optimistic gate: no session -> /login; refresh session cookie; idle timeout
app/layout.tsx                Inter via next/font, metadata robots noindex, Toaster
app/globals.css               copied tokens + admin sizing (body 14 px)
app/robots.ts                 Disallow: /
app/(auth)/layout.tsx         centred card on gray-50
app/(auth)/login/page.tsx     + login-form.tsx (client) + actions.ts
app/(auth)/mfa/page.tsx       enrol (QR) or verify (6-digit), + actions.ts
app/(auth)/forgot-password/page.tsx + actions.ts
app/(auth)/reset-password/page.tsx  + actions.ts (set new password after email link)
app/auth/callback/route.ts    exchanges the email link code for a session
app/(admin)/layout.tsx        shell: sidebar + top bar, requireAdmin() behind <Suspense>
app/(admin)/page.tsx          Dashboard placeholder ("Modules arrive here one by one")
app/(admin)/sign-out/actions.ts
components/admin/sidebar.tsx, mobile-nav.tsx, top-bar.tsx, user-menu.tsx, nav-items.ts
components/ui/*               shadcn base-nova, restyled to tokens
lib/constants.ts              ROLES, SESSION (idle/absolute minutes), PUBLIC_CACHE_TAGS, copied lead enums
lib/env.ts                    typed server env access
lib/auth/session.ts           getCurrentAdmin() / requireAdmin(): user + aal2 + active profile, else redirect
lib/auth/activity-cookie.ts   sign/verify idle-timeout cookie (HMAC with ADMIN_SESSION_SECRET)
lib/data/activity-log.ts      logActivity()
lib/data/profiles.ts
lib/supabase/server.ts        createServerClient (cookies) for the signed-in user
lib/supabase/admin.ts         secret-key client, import "server-only"
lib/supabase/types.ts         generated
lib/validation/auth.ts        Zod: login, mfa code, forgot, reset
lib/revalidate-public.ts      calls the public site's /api/revalidate
lib/domain/phone.ts           copied
lib/auth/activity-cookie.test.ts
supabase/                     moved from the public repo (config.toml, migrations, seed.sql)
supabase/migrations/20261024000000_admin_profiles_and_activity_log.sql
docs/supabase-setup.md        moved + extended with "create the client's account"
prompts/admin-app-setup.md    copy of this file
```

### Public repo `swapnobari` (branch `chore/admin-split`)

- Delete `supabase/` (moved). Keep `lib/supabase/types.ts`.
- Add `app/api/revalidate/route.ts` + `lib/validation/revalidate.ts`.
- Add `PUBLIC_CACHE_TAGS` to `lib/constants.ts` (contains `ESTIMATOR_CACHE_TAG` for now).
- `.env.example`: add `REVALIDATE_SECRET`.
- `AGENTS.md`: §7 admin layer now points to `swapnobari-admin`; §9 migrations live in the admin repo; types regenerated in both repos after every migration; env table gets `REVALIDATE_SECRET`.
- `docs/supabase-setup.md`: replace with a pointer to the admin repo's copy.

## Implementation requirements

**Login (`/login`)**
- Email + password, Zod-validated on the server. Errors are generic ("Email or password is incorrect"), never revealing whether the email exists.
- Rate limit: 5 failed attempts per email per 15 minutes on top of Supabase's own limits. Further attempts are blocked with "Too many attempts. Try again in 15 minutes." Counted in `auth_attempts` (email hash + time), no raw IPs.
- On success: no TOTP factor → `/mfa?enrol=1`; factor exists → `/mfa`. Never straight to the dashboard at `aal1`.
- If the user has no active `profiles` row: sign out immediately and show "This account does not have admin access."

**MFA (`/mfa`)**
- Enrol: show the QR code, the manual secret (copy button) and a 6-digit input. On verify → `aal2`, log `auth.mfa_enrolled` → dashboard.
- Verify: 6-digit input (`inputMode="numeric"`, `autoComplete="one-time-code"`, auto-submit on the 6th digit). Wrong code → inline error; after 5 wrong codes, sign out.
- "Sign in as someone else" link signs out.
- No "remember this device" in V1.

**Password reset**
- `/forgot-password`: always shows "If that email has an account, we've sent a reset link." Uses Supabase `resetPasswordForEmail` with `redirectTo = {ADMIN_SITE_URL}/auth/callback?next=/reset-password`.
- `/reset-password`: new password + confirm, min 12 characters, at least one letter and one digit. After the password is set, sign out everywhere (`scope: 'global'`) and send the user to `/login` with a success toast. Log `auth.password_reset`.

**Session and gate**
- `proxy.ts` (matcher excludes `_next`, static files, `/login`, `/mfa`, `/forgot-password`, `/reset-password`, `/auth/*`): refreshes the Supabase session cookie; no session → redirect `/login?next=…`; activity cookie expired → sign out + `/login?reason=timeout`; otherwise rolls the activity cookie forward.
- `requireAdmin()` in `lib/auth/session.ts` is the real check, called in the `(admin)` layout **and** at the top of every Server Action: valid user, `aal2`, active profile, absolute 12 h limit (from `auth.users.last_sign_in_at`). It is never cached.
- `/login?reason=timeout` shows "You were signed out after 60 minutes of inactivity."
- `next` param: only same-origin relative paths are honoured.

**Shell**
- Sidebar items exactly as DESIGN §13.2, in that order, Lucide icons. Only **Dashboard** is a live link; the others render disabled with a "Soon" tag so the client sees the roadmap. Each one becomes a link when its module ships.
- Top bar: page title, user menu (email, "Sign out"). Global search, city selector and the notifications bell are **not** built yet; they arrive with Leads.
- Dashboard placeholder: welcome line with the user's email, plus an empty state card "Modules arrive here one by one. Leads is next." No fake stats.

**Sign out**: Server Action, `signOut({ scope: 'local' })`, clears the activity cookie, logs `auth.sign_out`, redirects to `/login`.

**Public revalidate endpoint**: `POST /api/revalidate`. 401 without the exact Bearer secret (constant-time compare); 400 if any tag is outside `PUBLIC_CACHE_TAGS`; 200 `{ revalidated: [...] }`. No GET. Not cached.

## Data and RLS changes

Migration `supabase/migrations/20261024000000_admin_profiles_and_activity_log.sql` (in the admin repo):

- `profiles`: `id uuid pk references auth.users on delete cascade`, `full_name text`, `role text check in ('super_admin','admin','lead_executive')`, `city_id uuid null references cities`, `is_active boolean default true`, `created_at`, `updated_at` (trigger).
- `activity_log`: `id`, `actor_id uuid references profiles`, `action text` (e.g. `auth.sign_in`), `entity_type text null`, `entity_id text null`, `details jsonb default '{}'`, `created_at`. Append-only: no update/delete grants to anyone except `service_role` select/insert.
- `auth_attempts`: `id`, `email_hash text`, `succeeded boolean`, `created_at`; index `(email_hash, created_at desc)`. Service role only.
- Helper functions (`security definer`, `set search_path = ''`, `stable`): `public.current_role()`, `public.is_admin()` (active profile with role in `super_admin, admin`) and `public.is_super_admin()`. All three also require `(auth.jwt() ->> 'aal') = 'aal2'`.
- RLS on all three tables.
  - `profiles`: an authenticated user selects their own row; `is_super_admin()` selects all. No insert/update/delete from `authenticated` in this task (role changes go through SQL until the Users module).
  - `activity_log`: `is_super_admin()` select only. Inserts happen server-side with the secret key after `requireAdmin()`.
  - `auth_attempts`: no policies, revoked from anon/authenticated.
- Explicit grants in the same style as `20261023120000_explicit_api_grants.sql`.
- Existing tables are not changed in this task. Admin write policies for locations, budget, settings and leads are added with their modules.

After the migration: regenerate `lib/supabase/types.ts` in **both** repos.

## Security requirements

- `SUPABASE_SECRET_KEY` and `ADMIN_SESSION_SECRET` only in `lib/supabase/admin.ts` / `lib/auth/*`, all `import "server-only"`.
- Every Server Action: Zod parse → `requireAdmin()` (except the auth actions themselves) → data layer.
- Auth cookies `httpOnly`, `secure` in production, `sameSite=lax`. The activity cookie is HMAC-signed.
- Headers via `next.config.ts`: `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin`, `Permissions-Policy` (camera/mic/geo off), HSTS in production.
- No admin data is ever cached (`"use cache"` not used in the admin app in this task).
- `activity_log` entries: `auth.sign_in`, `auth.sign_in_failed` (email hash only), `auth.mfa_enrolled`, `auth.sign_out`, `auth.timeout`, `auth.password_reset`.
- `REVALIDATE_SECRET` is at least 32 random bytes and the same value in both apps' env.

## Environment variables (admin `.env.example`)

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | same project as the public site | client + server |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | user-session client (RLS) | client + server |
| `SUPABASE_SECRET_KEY` | server-only privileged writes | server only |
| `ADMIN_SITE_URL` | e.g. `http://localhost:3001`; reset-link redirects | server only |
| `ADMIN_SESSION_SECRET` | HMAC for the activity cookie | server only |
| `PUBLIC_SITE_URL` | public site base URL for revalidation | server only |
| `REVALIDATE_SECRET` | shared with the public site | server only |

Supabase dashboard (manual, in the test steps): add `http://localhost:3001/auth/callback` to the Redirect URLs, turn **off** "Allow new users to sign up", and enable TOTP MFA.

## UI

**Visual interpretation**: DESIGN §13.1, the same brand in a calmer tone. White and `gray-50` surfaces, `navy-900` structure, orange (`orange-500`, hover `orange-600`) only for the single primary button on each screen. Inter throughout. No Fraunces in admin.

**Auth pages** (`/login`, `/mfa`, `/forgot-password`, `/reset-password`)
- Full-height `gray-50` background. Centred white card, max-width 400 px, `radius-xl`, `shadow-brand-md`, 32 px padding (24 px under 400 px viewport width).
- Top of card: Swapnobari wordmark (same logo asset as the public site), then the H1 "Admin sign in" (20 px, 600, `navy-900`), then one muted line (`gray-500`, 14 px).
- Fields per DESIGN §7.2 at admin size: label 13 px 500 `gray-800`, input 44 px tall, `radius-md`, border `gray-200`, focus ring `navy-500`. Password field has a show/hide icon button (`aria-label`).
- Primary button: full width, 44 px, `orange-500`. Loading state shows a spinner and "Signing in…", disabled. Secondary links (`Forgot password?`) are `navy-700` text links.
- OTP input: 6 boxes, 44×48 px each, 8 px gap, centred; fits 360 px.
- Errors: inline under the field (`error` colour, 13 px), plus a form-level message in an `aria-live="polite"` region. Success and timeout notices use a `navy-50` info box.

**Shell**
- Sidebar: 240 px, `navy-900`, white text 14 px. Items are 40 px tall with 12 px horizontal padding, `radius-md`. The active item has a white/10 background and a 3 px `orange-500` left bar. Disabled items are white/40 with a small "Soon" pill. Logo area is 64 px. Collapse to 72 px (icons + tooltips) at `lg` with a toggle; the state is kept in a cookie.
- Top bar: 64 px, white, bottom border `gray-200`. Page title 18 px 600 `navy-900` on the left; user menu (avatar initial in a `navy-50` circle + chevron) on the right.
- Content: `gray-50` background, max-width 1400 px, 24 px padding (16 px on mobile).
- Mobile (< 1024 px): sidebar hidden; the top bar shows a menu button (`aria-label="Open menu"`) that opens the sidebar as a left Sheet drawer. Esc and backdrop close it, and focus is trapped. Tap targets ≥ 44 px.
- States: visible focus ring everywhere, hover `white/5` on nav items, reduced motion respected (no slide animation).

**360 px**: auth card and OTP boxes fit with no horizontal scroll; the drawer covers 85% of the width.

## Acceptance criteria

- [ ] `swapnobari-admin` runs on `localhost:3001` with Next 16.4.2, Tailwind tokens identical to the public site, `cacheComponents` on.
- [ ] Visiting any admin URL while signed out redirects to `/login?next=…`; after a full login it returns to that page (relative paths only).
- [ ] Correct password, first time → forced TOTP enrolment → dashboard. Later logins require the 6-digit code.
- [ ] Wrong password → generic error. 6th failed attempt within 15 min → blocked message. Failures are in `activity_log`.
- [ ] A valid auth user with no profile (or `is_active = false`) cannot enter; sees "no admin access".
- [ ] An `aal1` session (password done, code not entered) cannot reach any `(admin)` page or Server Action.
- [ ] Idle 60 min → next request lands on `/login?reason=timeout` (testable by temporarily setting idle to 1 minute).
- [ ] Forgot password → email → reset page → new password works and the old one doesn't; other sessions are signed out.
- [ ] Sign out works and is logged.
- [ ] Sidebar matches DESIGN §13.2 order; only Dashboard is live; the drawer works at 360 px with keyboard and Esc.
- [ ] `profiles`, `activity_log` and `auth_attempts` have RLS enabled; as an `authenticated` non-admin, selecting from them returns only your own profile and nothing else.
- [ ] Public site: `POST /api/revalidate` returns 401 without the secret, 400 for an unknown tag, 200 for `estimator`; `supabase/` is gone from the public repo; the public site's typecheck/lint/build still pass.
- [ ] Admin pages send `X-Robots-Tag: noindex` and `robots.txt` disallows everything.
- [ ] Typecheck, lint, build and unit tests pass in both repos.

## Checks

In `swapnobari-admin` and in `swapnobari`:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm test` (activity-cookie sign/verify/expiry; revalidate body validation)

## Manual test steps

1. Supabase dashboard → Authentication: disable new sign-ups; enable TOTP under Multi-Factor; add `http://localhost:3001/auth/callback` to Redirect URLs.
2. Apply the migration (`npx supabase db push` from `swapnobari-admin`, or paste it into the SQL editor). Create the client user (Authentication → Add user → email + password, "Auto confirm"). Then run `insert into public.profiles (id, full_name, role) select id, 'Client', 'super_admin' from auth.users where email = '<client email>';`
3. Fill `swapnobari-admin/.env.local` from `.env.example`. Generate secrets with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Put the same `REVALIDATE_SECRET` in `swapnobari/.env.local`.
4. `npm run dev` in both repos (public on 3000, admin on 3001).
5. Open `localhost:3001/` → redirected to `/login`. Wrong password 6 times → blocked message.
6. Correct login → QR screen → scan with Google Authenticator → enter code → dashboard.
7. Sign out → log in again → asked only for the code.
8. Create a second auth user without a profile → login → "no admin access".
9. Set `SESSION.idleMinutes = 1`, wait 2 minutes, click anything → timeout notice. Revert the value.
10. Forgot password → open the email link → set a new password → log in with it.
11. In Chrome DevTools at 360 px: auth card, OTP boxes and drawer fit, no horizontal scroll; Tab through the drawer, Esc closes it.
12. `curl -i -X POST localhost:3000/api/revalidate` → 401. With the header and `{"tags":["estimator"]}` → 200. With `{"tags":["nope"]}` → 400.
13. Supabase table editor → `activity_log` shows sign_in, sign_in_failed, mfa_enrolled, sign_out, timeout, password_reset rows.

## Next after this

Leads module (list, detail, status, notes, follow-up, WhatsApp/Call, export), then Locations and Budget Settings (first use of `/api/revalidate`).
