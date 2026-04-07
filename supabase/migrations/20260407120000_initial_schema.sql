-- Sistema CleanUp — CTO registry + port lots + RBAC profiles
-- Apply in Supabase SQL Editor or via `supabase db push` when using Supabase CLI.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users): role + approval gate
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'backoffice'
    check (role in ('admin', 'backoffice')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'App users; approved=false blocks CTO data via RLS.';

create index profiles_email_idx on public.profiles (lower(email));

-- New auth user → profile row (pending until admin approves)
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, approved)
  values (
    new.id,
    new.email,
    'backoffice',
    false
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user ();

-- ---------------------------------------------------------------------------
-- CTO + port lots (Portuguese column names as specified)
-- ---------------------------------------------------------------------------
create table public.cadastro_cto (
  id uuid primary key default gen_random_uuid (),
  nome_cto text not null unique,
  area text,
  olt text,
  slot integer,
  pon integer,
  capacidade integer not null
    check (capacidade in (8, 16)),
  potencia_dbm numeric,
  ultimo_cleanup timestamptz,
  vagas_atuais integer not null default 0
    check (vagas_atuais >= 0 and vagas_atuais <= 16)
);

comment on table public.cadastro_cto is 'Optical termination box (CTO) header.';

create table public.lotes_cto (
  id uuid primary key default gen_random_uuid (),
  cto_id uuid not null references public.cadastro_cto (id) on delete cascade,
  numero_porta integer not null
    check (numero_porta >= 1 and numero_porta <= 16),
  contrato text,
  status text not null
    check (
      status in (
        'Conectado com Contrato',
        'Conectado sem Contrato',
        'Livre'
      )
    ),
  unique (cto_id, numero_porta)
);

comment on table public.lotes_cto is 'Per-port occupancy for a CTO.';

-- Rule: contract required for "Conectado com Contrato"
alter table public.lotes_cto
  add constraint lotes_cto_contrato_when_contracted check (
    case
      when status = 'Conectado com Contrato' then
        contrato is not null
        and length(trim(contrato)) > 0
      else true
    end
  );

-- Rule: no stray contract text on non-contracted rows (keeps UI + counts simple)
alter table public.lotes_cto
  add constraint lotes_cto_contrato_only_when_needed check (
    case
      when status = 'Conectado com Contrato' then true
      else contrato is null or length(trim(contrato)) = 0
    end
  );

create index lotes_cto_cto_id_idx on public.lotes_cto (cto_id);

-- After any lot change: recount Livre ports and stamp ultimo_cleanup
create or replace function public.recalc_cto_after_lotes ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  target := coalesce(new.cto_id, old.cto_id);
  update public.cadastro_cto c
  set
    vagas_atuais = (
      select count(*)::integer
      from public.lotes_cto l
      where l.cto_id = target
        and l.status = 'Livre'
    ),
    ultimo_cleanup = now()
  where c.id = target;
  return coalesce(new, old);
end;
$$;

create trigger trg_lotes_recalc_cto
  after insert or update or delete on public.lotes_cto
  for each row
  execute function public.recalc_cto_after_lotes ();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_approved_user ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid ()
      and p.approved = true
  );
$$;

create or replace function public.is_approved_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid ()
      and p.approved = true
      and p.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.cadastro_cto enable row level security;
alter table public.lotes_cto enable row level security;

-- Profiles: each user reads own row; admins (approved) read all
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid ());

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_approved_admin ());

create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_approved_admin ())
  with check (public.is_approved_admin ());

-- CTO + lots: approved backoffice or admin
create policy "cadastro_cto_select"
  on public.cadastro_cto for select
  to authenticated
  using (public.is_approved_user ());

create policy "cadastro_cto_insert"
  on public.cadastro_cto for insert
  to authenticated
  with check (public.is_approved_user ());

create policy "cadastro_cto_update"
  on public.cadastro_cto for update
  to authenticated
  using (public.is_approved_user ())
  with check (public.is_approved_user ());

create policy "cadastro_cto_delete"
  on public.cadastro_cto for delete
  to authenticated
  using (public.is_approved_user ());

create policy "lotes_cto_select"
  on public.lotes_cto for select
  to authenticated
  using (public.is_approved_user ());

create policy "lotes_cto_insert"
  on public.lotes_cto for insert
  to authenticated
  with check (public.is_approved_user ());

create policy "lotes_cto_update"
  on public.lotes_cto for update
  to authenticated
  using (public.is_approved_user ())
  with check (public.is_approved_user ());

create policy "lotes_cto_delete"
  on public.lotes_cto for delete
  to authenticated
  using (public.is_approved_user ());

-- ---------------------------------------------------------------------------
-- Bootstrap note (run once in SQL editor as postgres / service role):
--   update public.profiles
--   set approved = true, role = 'admin'
--   where email = 'you@company.com';
-- ---------------------------------------------------------------------------
