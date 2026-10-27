-- WINZERA PRO: SINGLE-TABLE MASTER AUDIT (READ ONLY)
-- Paste the ENTIRE script into Supabase SQL Editor and press Run.
-- All checks appear in ONE result table. Safe to run repeatedly.
WITH required_tables(name) AS (
 SELECT unnest(ARRAY['organizations','users','institution_management','teams','sections','items','participants','item_assignments','marks','groups','bonuses','judge_links','team_sessions','team_auth_links','broadcast_links','org_config'])
), required_columns(tbl,col) AS (
 VALUES ('organizations','id'),('organizations','slug'),('organizations','settings'),
 ('organizations','broadcast_enabled'),('organizations','broadcast_payload'),
 ('organizations','broadcast_payload_updated_at'),('organizations','data_revision'),
 ('users','id'),('users','role'),('users','org_id'),
 ('institution_management','org_id'),('institution_management','admin_user_id'),
 ('institution_management','admin_username'),('institution_management','suspended')
), required_functions(signature) AS (
 VALUES ('resolve_org_slug(text)'),('winzera_current_org_id()'),('winzera_is_super_admin()'),
 ('wz_bump_org_revision()'),('wz_bump_settings_revision()')
), required_revision_triggers(tbl,trig) AS (
 VALUES ('organizations','wz_revision_settings'),('teams','wz_revision_teams'),
 ('sections','wz_revision_sections'),('items','wz_revision_items'),
 ('participants','wz_revision_participants'),('item_assignments','wz_revision_item_assignments'),
 ('marks','wz_revision_marks'),('groups','wz_revision_groups'),('bonuses','wz_revision_bonuses')
), results AS (
 SELECT '01 TABLE'::text AS category, name::text AS object,
 CASE WHEN to_regclass('public.'||name) IS NULL THEN 'MISSING' ELSE 'OK' END AS status,
 'Core database table'::text AS detail
 FROM required_tables
 UNION ALL
 SELECT '02 COLUMN',tbl||'.'||col,
 CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns c WHERE c.table_schema='public' AND c.table_name=tbl AND c.column_name=col) THEN 'OK' ELSE 'MISSING' END,
 'Required field'
 FROM required_columns
 UNION ALL
 SELECT '03 RLS',t.name,
 CASE WHEN c.oid IS NULL THEN 'MISSING TABLE' WHEN c.relrowsecurity THEN 'OK' ELSE 'WARNING' END,
 CASE WHEN c.oid IS NULL THEN 'Table not found' WHEN c.relrowsecurity THEN 'RLS enabled' ELSE 'RLS disabled - review' END
 FROM required_tables t
 LEFT JOIN pg_class c ON c.oid=to_regclass('public.'||t.name)
 UNION ALL
 SELECT '04 TENANT GUARD',t.name,
 CASE WHEN to_regclass('public.'||t.name) IS NULL THEN 'MISSING TABLE'
 WHEN EXISTS(SELECT 1 FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=t.name AND p.policyname='winzera_tenant_guard' AND p.permissive='RESTRICTIVE') THEN 'OK'
 ELSE 'REVIEW' END,
 'Expected restrictive policy for authenticated users'
 FROM required_tables t
 WHERE t.name IN ('teams','sections','items','participants','item_assignments','marks','groups','bonuses','judge_links','team_sessions','team_auth_links','broadcast_links','org_config')
 UNION ALL
 SELECT '05 REVISION TRIGGER',t.tbl||'.'||t.trig,
 CASE WHEN to_regclass('public.'||t.tbl) IS NULL THEN 'MISSING TABLE'
 WHEN EXISTS(SELECT 1 FROM pg_trigger g WHERE g.tgrelid=to_regclass('public.'||t.tbl) AND g.tgname=t.trig AND NOT g.tgisinternal AND g.tgenabled<>'D') THEN 'OK'
 ELSE 'MISSING' END,
 'Active change tracking trigger'
 FROM required_revision_triggers t
 UNION ALL
 SELECT '06 FUNCTION',signature,
 CASE WHEN to_regprocedure('public.'||signature) IS NOT NULL THEN 'OK' ELSE 'MISSING' END,
 'Function exists (not a behavioral test)'
 FROM required_functions
)
SELECT category,object,status,detail FROM results
ORDER BY category, CASE status WHEN 'MISSING' THEN 0 WHEN 'MISSING TABLE' THEN 0 WHEN 'WARNING' THEN 1 WHEN 'REVIEW' THEN 2 ELSE 3 END,object;
