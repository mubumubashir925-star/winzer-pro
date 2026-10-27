# Winzera Pro — Supabase setup

1. Open https://supabase.com/dashboard and select the project linked in `supabase-client.js`, or create a new project.
2. Check Supabase Authentication > Users and ensure intended administrator accounts exist.
3. Open SQL Editor and **first inspect/verify** existing schema. Required tables include `organizations`, `users`, `teams`, `sections`, `items`, `participants`, `item_assignments`, `marks`, `groups`, `bonuses`, `team_sessions`, `broadcast_links` and `judge_links`. The exact table definitions must match the client code.
4. Confirm Row Level Security is ON for every institution-owned table and role-specific policies prevent any other organization's reads and writes. Verify RPC functions including `team_login`, `resolve_org_slug`, `admin_set_team_credentials`, and `admin_create_judge_link` exist and enforce authorization. Functions declared SECURITY DEFINER must validate the requesting principal and target organization.
5. Enable publication for authenticated Realtime table changes as appropriate, then test changes using two signed-in browsers and two different organizations to verify isolation.
6. Set Storage bucket `photos` policies for organization-specific uploads. Public photo visibility is a privacy decision; avoid public bucket if student photos require restricted access.
7. Add the Cloudflare Pages project: Workers & Pages > Create application > Pages > Connect to Git > select `winzer-pro`, production branch `main`, framework `None`, build command blank, output `/`.
8. Test admin login, org creation, team login, participant sync, judge links, and broadcasts with dummy accounts before production.

**Missing dependency:** `schema-v2-migration.sql` is referenced by the uploaded client but absent from the ZIP. Reconstructing it from assumptions could expose student data or break existing tables. Supply the original migration SQL or a database schema export, excluding passwords and secrets, before switching to real data.
