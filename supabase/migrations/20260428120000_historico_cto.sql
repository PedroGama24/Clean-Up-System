-- Histórico de auditoria (criação / atualização por BKO)
create table public.historico_cto (
  id uuid primary key default gen_random_uuid (),
  cto_id uuid not null references public.cadastro_cto (id) on delete cascade,
  bko_nome text not null,
  acao text not null,
  created_at timestamptz not null default now ()
);

comment on table public.historico_cto is 'Trilha de auditoria: quem criou ou atualizou a CTO e quando.';

create index historico_cto_cto_id_idx on public.historico_cto (cto_id, created_at desc);

alter table public.historico_cto enable row level security;

create policy "historico_cto_select"
  on public.historico_cto for select
  to authenticated
  using (public.is_approved_user ());

create policy "historico_cto_insert"
  on public.historico_cto for insert
  to authenticated
  with check (public.is_approved_user ());
