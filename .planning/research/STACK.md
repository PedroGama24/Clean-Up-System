# Stack Research — Internal telecom CTO backoffice

**Project:** Sistema CleanUp  
**Researched:** 2026-04-07  
**Confidence:** HIGH (user-specified)

## Recommendation

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js App Router + React | SSR/SSG, API routes, Vercel-native |
| Styling | Tailwind CSS | Fast iteration, consistent spacing/typography |
| Components | shadcn/ui | Accessible primitives, tables, forms |
| Backend | Supabase (Postgres + Auth + RLS) | Hosted Postgres, JWT sessions, policy-based security |
| Deploy | Vercel | First-class Next.js hosting |

## Versions

Pin in `package.json` at scaffold time (use `create-next-app` defaults for current stable).

## Avoid

- Custom auth server in v1 — duplicates Supabase capabilities.
- Client-only Firebase-style rules — Postgres RLS is the source of truth for data.
