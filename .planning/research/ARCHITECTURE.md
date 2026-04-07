# Architecture — Sistema CleanUp

## Components

1. **Next.js (browser + server)** — UI, Server Components where helpful, Route Handlers or Server Actions for mutations calling Supabase with user JWT.
2. **Supabase Auth** — Email/password; session in cookies via `@supabase/ssr`.
3. **Supabase Postgres** — `profiles`, `cadastro_cto`, `lotes_cto`; RLS ties `auth.uid()` to approved profiles.
4. **Triggers** — Recompute `vagas_atuais` / `ultimo_cleanup` on `lotes_cto` changes (or equivalent transactional path).

## Data flow

Browser → Supabase client (anon key + session) → Postgres with RLS. Admin approval updates `profiles.approved`; RLS checks that flag for CTO access.

## Build order

Schema + RLS → auth shell → dashboard read paths → write form + triggers verification.
