# Roadmap: Sistema CleanUp

**Phases:** 4 | **Granularity:** Standard | **Mode:** YOLO

## Overview

| # | Phase | Goal | Requirements |
|---|--------|------|----------------|
| 1 | Foundation & data model | Supabase schema, RLS, profiles, triggers for `vagas_atuais` / `ultimo_cleanup` | AUTH-*, PLAT-01, PLAT-02 |
| 2 | App shell & auth UX | Next.js scaffold, Supabase clients, login, protected layout, responsive shell | AUTH-01–05, PLAT-03 |
| 3 | CTO dashboard | List CTOs, search by name, show last clean-up and available ports | CTO-01, CTO-02 |
| 4 | CTO form & port grid | Dynamic 8/16 rows, status UX, validation, save with recalculation | CTO-03–09 |

---

## Phase 1: Foundation & data model

**Goal:** Database and security baseline so no CTO data is exposed to anonymous or unapproved users, and occupancy fields stay consistent.

**UI hint:** no

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, PLAT-01, PLAT-02

**Success criteria:**

1. Tables `cadastro_cto`, `lotes_cto`, and `profiles` exist with constraints (capacity 8|16, port 1–16, valid status).
2. RLS policies enforce: only approved authenticated users can CRUD CTO/port data; users can read their own profile.
3. Trigger or transactional routine updates `vagas_atuais` and `ultimo_cleanup` when port rows change.
4. New sign-up creates a profile row with `approved = false` by default.

---

## Phase 2: App shell & auth UX

**Goal:** Runnable Next.js app on Vercel path with working login/session and guarded routes.

**UI hint:** yes

**Requirements:** (carried from Phase 1 for app wiring) AUTH-01–05, PLAT-03

**Success criteria:**

1. User can open a login page and sign in with Supabase email/password.
2. Protected routes redirect unauthenticated users to login.
3. Unapproved users see a clear “pending approval” state instead of CTO data.
4. Layout is usable on desktop and tablet widths.

---

## Phase 3: CTO dashboard

**Goal:** Operators can find CTOs quickly and see operational signals at a glance.

**UI hint:** yes

**Requirements:** CTO-01, CTO-02

**Success criteria:**

1. Table (or equivalent) lists all CTOs with nome, último cleanup, vagas atuais.
2. Search narrows rows by `nome_cto` substring (case-insensitive).
3. Navigation to create/edit CTO is available from the dashboard.

---

## Phase 4: CTO form & port grid

**Goal:** Single workflow to audit all ports and persist with correct business rules.

**UI hint:** yes

**Requirements:** CTO-03–CTO-09

**Success criteria:**

1. Creating/editing a CTO uses shadcn form patterns; capacity toggles 8 vs 16 port rows only.
2. Status selection does not require typing status text; contract field validates when required.
3. Visual distinction matches spec for warning vs livre states.
4. Save writes all ports and parent CTO fields reflect new counts and timestamp.

---

*Roadmap created: 2026-04-07*
