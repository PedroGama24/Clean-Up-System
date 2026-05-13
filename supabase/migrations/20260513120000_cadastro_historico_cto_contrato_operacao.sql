-- Contrato da operação (cabeçalho da CTO), distinto de lotes_cto.contrato (por porta).

alter table public.cadastro_cto
  add column if not exists contrato text not null default '';

comment on column public.cadastro_cto.contrato is
  'Contrato da operação / clean up (cabeçalho). Distinto dos contratos por porta em lotes_cto.';

alter table public.historico_cto
  add column if not exists contrato text null;

comment on column public.historico_cto.contrato is
  'Valor do contrato da operação na altura da ação (criação ou atualização).';
