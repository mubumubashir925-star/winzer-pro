-- WINZERA PRO MASTER BACKEND AUDIT v1
-- READ ONLY. Safe to run repeatedly. Does not modify tables, policies, or data.
-- Run in Supabase SQL Editor. Each result is a separate report.
SELECT '01 CORE TABLES' AS report, x.table_name,
       CASE WHEN to_regclass('public.'||x.table_name) IS NULL THEN 'MISSING' ELSE 'OK' END AS status
FROM unnest(ARRAY['organizations','users','institution_management','teams','sections','items','participants','item_assignments','marks','groups','bonuses','judge_links','team_sessions','team_auth_links','broadcast_links','org_config']) AS x(table_name)
ORDER BY x.table_name;

SELECT '02 REQUIRED COLUMNS' AS report, x.table_name, x.column_name,
       CASE WHEN c.column_name IS NULL THEN 'MISSING' ELSE 'OK' END AS status
FROM (VALUES ('organizations','id'),('organizations','slug'),('organizations','settings'),('organizations','broadcast_enabled'),
 ('organizations','broadcast_payload'),('organizations','broadcast_payload_updated_at'),('organizations','data_revision'),
 ('users','id'),('users','role'),('users','org_id'),
 ('institution_management','org_id'),('institution_management','admin_user_id'),
 ('institution_management','admin_username'),('institution_management','suspended')) AS x(table_name,column_name)
LEFT JOIN information_schema.columns c ON c.table_schema='public' AND c.table_name=x.table_name AND c.column_name=x.column_name
ORDER BY x.table_name,x.column_name;

SELECT '03 ROW LEVEL SECURITY' AS report, c.relname AS table_name,
       CASE WHEN c.relrowsecurity THEN 'ENABLED' ELSE 'DISABLED - REVIEW' END AS status
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','p')
  AND c.relname IN ('organizations','users','institution_management','teams','sections','items','participants','item_assignments','marks','groups','bonuses','judge_links','team_sessions','team_auth_links','broadcast_links','org_config')
ORDER BY c.relname;

SELECT '04 POLICIES' AS report, tablename, policyname, permissive, roles, cmd
FROM pg_policies WHERE schemaname='public' AND tablename IN
('organizations','users','institution_management','teams','sections','items','participants','item_assignments','marks','groups','bonuses','judge_links','team_sessions','team_auth_links','broadcast_links','org_config')
ORDER BY tablename,policyname;

SELECT '05 REVISION TRIGGERS' AS report, c.relname AS table_name, t.tgname AS trigger_name,
 CASE WHEN t.tgname IS NULL THEN 'MISSING' ELSE 'OK' END AS status
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
LEFT JOIN pg_trigger t ON t.tgrelid=c.oid AND NOT t.tgisinternal
  AND (t.tgname LIKE 'wz_revision_%')
WHERE n.nspname='public' AND c.relname IN
('organizations','teams','sections','items','participants','item_assignments','marks','groups','bonuses')
ORDER BY c.relname,t.tgname;

SELECT '06 FUNCTIONS' AS report, x.function_name,
 CASE WHEN to_regprocedure('public.'||x.function_name) IS NULL THEN 'MISSING' ELSE 'OK' END AS status
FROM unnest(ARRAY['winzera_current_org_id()','winzera_is_super_admin()','wz_bump_org_revision()','wz_bump_settings_revision()','resolve_org_slug(text)']) AS x(function_name)
ORDER BY x.function_name;

-- Diagnostic only: existing organizations without management metadata.
-- No usernames, passwords, tokens or sensitive account details are returned.
DO $audit$
BEGIN
 IF to_regclass('public.organizations') IS NULL OR to_regclass('public.institution_management') IS NULL THEN
   RAISE NOTICE '07 LEGACY INSTITUTIONS: skipped, required table missing';
 ELSE
   RAISE NOTICE '07 LEGACY INSTITUTIONS: use the query below only after both tables exist';
 END IF;
END $audit$;

-- Edge Functions, Auth email delivery, JWT/RLS behavior, and realtime publication
-- CANNOT be fully verified by this SQL. Test those separately.
