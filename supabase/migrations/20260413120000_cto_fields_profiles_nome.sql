-- Refactor cadastro_cto (CleanUp alinhamento) + profiles.nome_completo

-- ---------------------------------------------------------------------------
-- profiles: nome completo + trigger em novos usuários
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists nome_completo text;

comment on column public.profiles.nome_completo is 'Nome exibido em rastreabilidade BKO (cadastro CTO).';

create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, approved, nome_completo)
  values (
    new.id,
    new.email,
    'backoffice',
    false,
    nullif(trim(coalesce(new.raw_user_meta_data->>'nome_completo', '')), '')
  );
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- cadastro_cto: novas colunas, backfill, remover legado
-- ---------------------------------------------------------------------------
alter table public.cadastro_cto
  add column if not exists cidade text,
  add column if not exists identificacao_cto text,
  add column if not exists tecnico_campo text,
  add column if not exists bko_nome text,
  add column if not exists observacoes text;

update public.cadastro_cto
set
  cidade = coalesce(nullif(trim(cidade), ''), 'BMA'),
  identificacao_cto = coalesce(
    nullif(trim(identificacao_cto), ''),
    nullif(trim(nome_cto), ''),
    'MIGRADO'
  ),
  tecnico_campo = coalesce(
    nullif(trim(tecnico_campo), ''),
    'AMERICO DE MELO BROTTO'
  ),
  bko_nome = coalesce(nullif(trim(bko_nome), ''), '—');

alter table public.cadastro_cto
  alter column cidade set not null,
  alter column identificacao_cto set not null,
  alter column tecnico_campo set not null,
  alter column bko_nome set not null;

alter table public.cadastro_cto
  drop constraint if exists cadastro_cto_nome_cto_key;

alter table public.cadastro_cto
  drop column if exists nome_cto,
  drop column if exists area,
  drop column if exists primaria_codigo,
  drop column if exists primaria_valor_diario,
  drop column if exists potencia_dbm;

comment on column public.cadastro_cto.cidade is 'Código da cidade (lista restrita no app).';
comment on column public.cadastro_cto.identificacao_cto is 'Identificação da CTO na operação.';
comment on column public.cadastro_cto.tecnico_campo is 'Técnico de campo (lista restrita no app).';
comment on column public.cadastro_cto.bko_nome is 'Último BKO que criou/atualizou (profiles.nome_completo).';
comment on column public.cadastro_cto.observacoes is 'Observações opcionais do clean up.';
