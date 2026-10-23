-- Enforce "leads are never hard-deleted" (AGENTS.md §9) at the privilege level.
-- Grants only add privileges: on projects that auto-granted table privileges, service_role
-- still holds DELETE/TRUNCATE on leads, and it bypasses RLS. Revoke them explicitly.
-- Idempotent: revoking a privilege that is not held is a no-op.

revoke delete, truncate on public.leads from service_role;

-- anon/authenticated never touch leads (written and read only by the server).
revoke all on public.leads from anon, authenticated;
revoke all on sequence public.lead_ref_seq from anon, authenticated;
