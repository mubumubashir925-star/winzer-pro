# Winzera Pro

Winzera Pro is a multi-organization competition management PWA. The imported V1 app uses Supabase Auth, PostgreSQL, Storage, RPC, and Realtime.

## Deployment

Host this repository on Cloudflare Pages with framework preset **None**, build command empty, and output directory `/` (repository root).

## Supabase prerequisite

The uploaded `supabase-client.js` points to an existing Supabase project, but the required database schema / RLS policies / RPC functions are **not** included in V1.zip. Do not launch with real institution data until the database schema and row-level security are installed and tested.

See `BACKEND-SETUP.md` for steps. The Supabase publishable key is not a secret; **never** commit a service-role/secret key.
