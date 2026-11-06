# Supabase setup

The database schema, migrations, seed data and setup steps now live in the admin repo:

**`E:\Web Dev\swapnobari-admin\docs\supabase-setup.md`**

This repo only keeps `lib/supabase/types.ts`. After each migration (run from `swapnobari-admin`), regenerate the types there and copy the file here:

```bash
npx supabase gen types typescript --linked > lib/supabase/types.ts
```

The public site's environment variables are listed in `.env.example`. `REVALIDATE_SECRET` must match the admin app's value.
