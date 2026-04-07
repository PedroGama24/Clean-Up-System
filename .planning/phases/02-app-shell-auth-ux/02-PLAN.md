---
wave: 1
depends_on: []
files_modified:
  - lib/supabase/middleware.ts
  - middleware.ts
  - app/login/page.tsx
  - app/login/login-form.tsx
  - app/register/page.tsx
  - app/register/register-form.tsx
  - app/pending-approval/page.tsx
  - app/dashboard/layout.tsx
  - app/dashboard/page.tsx
  - app/page.tsx
  - components/auth/sign-out-button.tsx
  - components/ui/card.tsx
  - components/ui/input.tsx
  - components/ui/label.tsx
autonomous: true
requirements_addressed:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
  - AUTH-05
  - PLAT-03
---

# Plan 02 — App shell & auth UX (executado)

## Objective

Entregar login e registro com Supabase Auth, proteção de `/dashboard` no middleware com gate `profiles.approved`, tela de acesso pendente e shell do painel com logout.

## Verification

- `npm run build` conclui sem erros de tipo ou lint.
- Rotas: `/login`, `/register`, `/pending-approval`, `/dashboard`.
- Middleware redireciona não autenticado de `/dashboard` para `/login?next=…`.
- Usuário autenticado com `approved = false` é redirecionado para `/pending-approval` ao acessar `/dashboard`.
- Registro exibe a mensagem fixa de aguardo de aprovação do Administrador de TI.

## Tasks (referência)

<task id="auth-routes">
  <action>Implementar páginas `/login` e `/register` com Card shadcn, `signInWithPassword` e `signUp`, mensagem pós-registro obrigatória em PT-BR.</action>
  <read_first>lib/supabase/client.ts, components/ui/card.tsx</read_first>
  <acceptance_criteria>register-form.tsx contém o texto exato de aguardo de aprovação; login-form integra createClient().auth.signInWithPassword.</acceptance_criteria>
</task>

<task id="middleware-guard">
  <action>Estender lib/supabase/middleware.ts: após getUser(), consultar profiles.approved; proteger /dashboard; copiar cookies da resposta de sessão para redirects.</action>
  <read_first>supabase/migrations/20260407120000_initial_schema.sql</read_first>
  <acceptance_criteria>lib/supabase/middleware.ts consulta tabela profiles e redireciona para /login ou /pending-approval conforme estado.</acceptance_criteria>
</task>

<task id="dashboard-shell">
  <action>Layout em app/dashboard/layout.tsx com cabeçalho "Sistema CleanUp", placeholder de CTOs em page.tsx, SignOutButton com signOut + replace /login.</action>
  <read_first>components/ui/button.tsx</read_first>
  <acceptance_criteria>app/dashboard/layout.tsx exporta header com título e SignOutButton; app/dashboard/page.tsx menciona listagem futura de CTOs.</acceptance_criteria>
</task>
