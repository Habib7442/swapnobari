-- Swapnobari: locations, cost estimator settings, site settings and leads.
-- RLS is enabled on every table. Public (anon) can read only published reference data.
-- `leads` has no anon/authenticated policies: it is written only by the server (secret key).

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Locations: states -> cities -> areas
-- ---------------------------------------------------------------------------

create table public.states (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'coming_soon')),
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  state_id uuid not null references public.states (id) on delete restrict,
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'coming_soon')),
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index cities_state_id_idx on public.cities (state_id);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete restrict,
  name text not null,
  slug text not null,
  pin text check (pin is null or pin ~ '^[1-9][0-9]{5}$'),
  status text not null default 'active' check (status in ('active', 'coming_soon')),
  sort int not null default 0,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);
create index areas_city_id_idx on public.areas (city_id);

-- ---------------------------------------------------------------------------
-- Cost estimator
-- ---------------------------------------------------------------------------

create table public.budget_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  sort int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Rate per sq ft of built-up area, per city and package (integer rupees).
create table public.budget_rates (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete cascade,
  package_id uuid not null references public.budget_packages (id) on delete cascade,
  rate_per_sqft int not null check (rate_per_sqft > 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (city_id, package_id)
);
create index budget_rates_package_id_idx on public.budget_rates (package_id);
create trigger budget_rates_set_updated_at
  before update on public.budget_rates
  for each row execute function public.set_updated_at();

-- "What's included" rows for the package comparison table.
create table public.budget_package_features (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.budget_packages (id) on delete cascade,
  label text not null,
  value text not null,
  sort int not null default 0
);
create index budget_package_features_package_id_idx on public.budget_package_features (package_id);

-- Stage-wise split of the total cost. Percentages must add up to 100 (checked in the app).
create table public.budget_stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  percent numeric(5, 2) not null check (percent >= 0 and percent <= 100),
  ground_floor_only boolean not null default false,
  sort int not null default 0
);

-- ---------------------------------------------------------------------------
-- Site settings (key/value). Only rows with is_public = true are readable by anon.
-- ---------------------------------------------------------------------------

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------

create sequence public.lead_ref_seq start 1;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null unique default ('SB-' || lpad(nextval('public.lead_ref_seq')::text, 6, '0')),
  type text not null check (type in (
    'budget_estimate', 'consultation', 'floor_plan', 'vastu', 'az_construction',
    'plan_review', 'shubh_nirman', 'material_price', 'dealer_enquiry', 'general_contact'
  )),
  status text not null default 'new' check (status in (
    'new', 'contacted', 'consultation_scheduled', 'quoted', 'won', 'lost', 'not_reachable', 'duplicate'
  )),
  name text not null check (char_length(name) between 2 and 80),
  mobile text not null check (mobile ~ '^\+91[6-9][0-9]{9}$'),
  city_id uuid references public.cities (id) on delete set null,
  area_id uuid references public.areas (id) on delete set null,
  area_other text check (area_other is null or char_length(area_other) <= 120),
  details jsonb not null default '{}'::jsonb,
  source_page text,
  source_button text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  device text check (device is null or device in ('mobile', 'tablet', 'desktop')),
  consent boolean not null check (consent),
  is_duplicate boolean not null default false,
  duplicate_of uuid references public.leads (id) on delete set null,
  result_token text unique,
  ip_hash text,
  assigned_to uuid,
  follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_mobile_created_at_idx on public.leads (mobile, created_at desc);
create index leads_ip_hash_created_at_idx on public.leads (ip_hash, created_at desc);
create index leads_status_created_at_idx on public.leads (status, created_at desc);
create index leads_city_id_idx on public.leads (city_id);
create index leads_area_id_idx on public.leads (area_id);
create index leads_duplicate_of_idx on public.leads (duplicate_of);
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.states enable row level security;
alter table public.cities enable row level security;
alter table public.areas enable row level security;
alter table public.budget_packages enable row level security;
alter table public.budget_rates enable row level security;
alter table public.budget_package_features enable row level security;
alter table public.budget_stages enable row level security;
alter table public.site_settings enable row level security;
alter table public.leads enable row level security;

create policy "Public can read active states"
  on public.states for select to anon, authenticated
  using (status in ('active', 'coming_soon'));

create policy "Public can read active cities"
  on public.cities for select to anon, authenticated
  using (status in ('active', 'coming_soon'));

create policy "Public can read active areas"
  on public.areas for select to anon, authenticated
  using (status = 'active');

create policy "Public can read active packages"
  on public.budget_packages for select to anon, authenticated
  using (is_active);

create policy "Public can read active rates"
  on public.budget_rates for select to anon, authenticated
  using (is_active);

create policy "Public can read package features"
  on public.budget_package_features for select to anon, authenticated
  using (true);

create policy "Public can read budget stages"
  on public.budget_stages for select to anon, authenticated
  using (true);

create policy "Public can read public settings"
  on public.site_settings for select to anon, authenticated
  using (is_public);

-- leads: intentionally no policies. Only the server (secret key, bypasses RLS) reads or writes.
revoke all on public.leads from anon, authenticated;
revoke all on sequence public.lead_ref_seq from anon, authenticated;
