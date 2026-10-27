-- Backfill management metadata for institutions created before the new dashboard.
-- Non-destructive: does not delete organizations, users, or competition data.
-- Review matched admin users after running; legacy accounts may not have an admin.
INSERT INTO public.institution_management
  (org_id, admin_user_id, admin_username, plan, participant_limit, suspended)
SELECT o.id,
       u.id,
       CASE WHEN u.id IS NULL THEN NULL ELSE 'legacy-admin' END,
       'legacy',
       0,
       false
FROM public.organizations o
LEFT JOIN LATERAL (
  SELECT id FROM public.users
  WHERE org_id = o.id AND role = 'admin'
  ORDER BY id LIMIT 1
) u ON true
WHERE NOT EXISTS (
  SELECT 1 FROM public.institution_management m WHERE m.org_id = o.id
);
-- Inspect results. Do not reset passwords for rows without admin_user_id.
SELECT o.name, o.slug, m.org_id, m.admin_user_id, m.admin_username
FROM public.organizations o
LEFT JOIN public.institution_management m ON m.org_id = o.id
ORDER BY o.name;
