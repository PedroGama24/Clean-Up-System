---
wave: 1
depends_on: []
files_modified:
  - app/dashboard/page.tsx
  - app/dashboard/layout.tsx
  - app/dashboard/actions.ts
  - app/dashboard/cto-table-section.tsx
  - app/dashboard/cto-table-skeleton.tsx
  - app/dashboard/nova-cto/page.tsx
  - components/dashboard/cto-data-table.tsx
  - components/dashboard/nova-cto-form.tsx
  - components/providers.tsx
  - app/layout.tsx
  - lib/validations/nova-cto.ts
  - lib/format.ts
autonomous: true
requirements_addressed:
  - CTO-01
  - CTO-02
  - CTO-03
  - CTO-04
  - CTO-05
  - CTO-06
  - CTO-07
  - CTO-08
  - CTO-09
---

# Plan 03 — Dashboard CTO + formulário dinâmico (executado)

## Objective

Listar `cadastro_cto` em data table com estados de loading/vazio; fluxo `/dashboard/nova-cto` em 3 passos com RHF + Zod, `useFieldArray` para portas, insert CTO + bulk `lotes_cto`, toast e retorno ao painel.

## Verification

- `npm run build` sem erros.
- Rotas `/dashboard` (dinâmico com Suspense) e `/dashboard/nova-cto`.
- Colunas: nome, OLT, slot, PON, capacidade, vagas, último clean up.
- Submissão chama `createCtoWithLotes`; sucesso dispara `toast.success` e `router.push('/dashboard')`.
