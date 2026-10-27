# Institution Management deployment checklist

The Super Admin UI is committed, but the secure backend requires manual Supabase deployment. The app cannot provision institution admin credentials until this is completed.

1. In Supabase SQL Editor, run `supabase/institution-management.sql`.
2. Deploy `supabase/functions/institution-admin/index.ts` as Edge Function `institution-admin`, **with JWT verification enabled**. Set standard Supabase environment variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` as server-side secrets only.
3. Ensure the signed-in platform owner has `public.users.role = 'super_admin'`; do not assign this role from a client.
4. Test creating an institution with a slug and admin username/password. The function provisions a Supabase Auth account using internal email `<slug>--<username>@accounts.winzera.invalid` and inserts the `users` role mapping. The institute admin enters **username** (not internal email) at `/<slug>/admin`.
5. Test authorization with a non-super-admin account, tenant mismatch, duplicate slugs, reset password, deletion with operational records, and page reload.
6. Cloudflare Pages should route unknown paths to `index.html`; `/super-admin` redirects to `/super-admin.html`.

**Known limitations requiring follow-up:** The status/suspend flag is currently management metadata and does NOT revoke Auth sessions or enforce tenant access. Do not treat Suspend as an effective lockout until enforced in backend RLS/authentication. Edit form currently supports name/plan/contact/notes only; username changes need a dedicated secure Auth migration action. Delete refuses organizations with operational data. The backend migration and Edge Function have NOT been deployed or live-tested by the GitHub commits alone. Passwords are not stored in the management table and are shown in the share popup only immediately after creation or reset; distribute them privately.

The current public route uses the broadcast payload viewer, so it may show a waiting state until broadcast is enabled. This is not yet a full always-available public portal.
