-- cadastro_cto: localização exata do Clean Up (bairro + rua)

alter table public.cadastro_cto
  add column if not exists bairro text not null default '',
  add column if not exists rua text not null default '';

comment on column public.cadastro_cto.bairro is 'Bairro da CTO (obrigatório no app; default temporário para registros legados).';
comment on column public.cadastro_cto.rua is 'Rua/logradouro da CTO (obrigatório no app; default temporário para registros legados).';
