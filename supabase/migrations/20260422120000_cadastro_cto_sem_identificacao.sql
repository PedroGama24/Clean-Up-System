-- CTO “sem identificação visual”: flag e índice único apenas quando não for esse caso
-- (evita conflito ao permitir vários registros com identificacao_cto = "Sem Identificação" na mesma cidade)
alter table public.cadastro_cto
  add column if not exists sem_identificacao boolean not null default false;

comment on column public.cadastro_cto.sem_identificacao is
  'Quando true, identificacao_cto fica "Sem Identificação" e os demais campos de identificação ficam nulos.';

drop index if exists public.cadastro_cto_cidade_identificacao_cto_key;

create unique index if not exists cadastro_cto_cidade_identificacao_cto_key
  on public.cadastro_cto (cidade, identificacao_cto)
  where not sem_identificacao;

comment on index public.cadastro_cto_cidade_identificacao_cto_key is
  'Identificação de CTO é única por cidade quando a linha recebeu identificação operacional.';
