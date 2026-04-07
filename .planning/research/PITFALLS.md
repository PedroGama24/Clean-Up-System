# Pitfalls — Internal ops web apps + Supabase

1. **RLS gaps** — Forgetting `approved` in policies exposes data to pending users. *Prevention:* central helper policies and integration tests.
2. **Client-trust** — Computing `vagas_atuais` only in the browser. *Prevention:* DB trigger or server-side transaction.
3. **Status typos** — Free-text status breaks counts. *Prevention:* `CHECK` constraint or enum type in Postgres.
4. **Port row drift** — Fewer than N rows for capacity. *Prevention:* validate row count on save and unique `(cto_id, numero_porta)`.
