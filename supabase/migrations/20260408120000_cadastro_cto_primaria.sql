-- Primária quando não há código de área: referência informada pelo BKO.
alter table public.cadastro_cto
  add column if not exists primaria_codigo text;

comment on column public.cadastro_cto.primaria_codigo is 'Sem área conhecida: código de referência Primária (BKO).';
