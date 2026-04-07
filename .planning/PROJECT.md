# Sistema CleanUp (CTO Backoffice)

## What This Is

A secure, responsive web application for a telecom backoffice team to register, audit, and track port occupancy (8 or 16 ports) in optical termination boxes (CTOs). The system automatically calculates available ports from per-port status and supports Admin / Backoffice roles with approval-gated sign-ups.

## Core Value

Authenticated staff can reliably see every CTO’s occupancy and last clean-up, and save a full port-level audit in one flow—with `vagas_atuais` and `ultimo_cleanup` kept accurate automatically.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Supabase schema, RLS, and profiles with Admin / Backoffice + approval gate
- [ ] Next.js app with Supabase auth client and protected routes
- [ ] CTO index with search by `nome_cto` and key columns (last clean-up, available ports)
- [ ] CTO create/edit form with dynamic 8/16 port rows and status UX (radio/badges)
- [ ] Port status rules: contract required for “Conectado com Contrato”; visual cues for other states
- [ ] Persist lotes and recalculate `vagas_atuais` + `ultimo_cleanup` on save
- [ ] Deploy path documented for Vercel + Supabase

### Out of Scope

- Mobile native apps — web-first per stack choice
- Public self-service signup without admin approval — all new users stay pending until approved
- Non-Supabase auth providers in v1 — email/password via Supabase is sufficient unless added later

## Context

- **Users:** Backoffice operators daily; one Admin (account owner) approves new users.
- **Domain:** CTO registry tied to OLT/slot/PON; ports numbered 1–16 with constrained statuses.
- **Stack (decided):** Next.js App Router, React, Tailwind, shadcn/ui, Supabase (Postgres + Auth), Vercel.

## Constraints

- **Tech:** Next.js, Tailwind, shadcn/ui, Supabase, Vercel — fixed for v1.
- **Data:** `capacidade` ∈ {8, 16}; port `numero_porta` 1–16; status ∈ three allowed Portuguese labels.
- **Security:** RLS on all tenant data; only authenticated, approved users access CTO data.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase for DB + Auth | Single platform for Postgres, RLS, and session handling | — Pending |
| shadcn/ui for tables/forms | Consistent accessible UI with Tailwind | — Pending |
| Portuguese domain labels in DB | Matches operator language (`nome_cto`, status strings) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-07 after initialization*
