-- Explicit Data API grants, so access never depends on the project's auto-expose default.
-- supabase/config.toml sets auto_expose_new_tables = false: local resets get only these grants.
-- Grants open the table to a role; RLS policies still decide which rows it sees.
-- Idempotent on projects that already auto-granted these privileges.

-- Published reference data: read-only for visitors (anon) and signed-in users (authenticated).
grant select on
  public.states,
  public.cities,
  public.areas,
  public.budget_packages,
  public.budget_rates,
  public.budget_package_features,
  public.budget_stages,
  public.site_settings
to anon, authenticated;

-- Server (secret key). It bypasses RLS but still needs table privileges.
grant select, insert, update, delete on
  public.states,
  public.cities,
  public.areas,
  public.budget_packages,
  public.budget_rates,
  public.budget_package_features,
  public.budget_stages,
  public.site_settings
to service_role;

-- Leads are never hard-deleted (AGENTS.md §9), so no delete. anon/authenticated stay revoked.
grant select, insert, update on public.leads to service_role;
-- The ref_code default calls nextval().
grant usage, select on sequence public.lead_ref_seq to service_role;
