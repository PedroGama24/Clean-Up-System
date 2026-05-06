-- Atualiza a unicidade operacional do cadastro de CTO.
-- Mantém a exceção para registros "sem identificação visual".

drop index if exists public.cadastro_cto_cidade_identificacao_cto_key;
drop index if exists public.cadastro_cto_identificacao_olt_slot_pon_tecnologia_key;

create unique index if not exists cadastro_cto_identificacao_olt_slot_pon_tecnologia_key
  on public.cadastro_cto (
    identificacao_cto,
    olt,
    slot,
    pon,
    coalesce(nullif(trim(tecnologia), ''), 'N/A')
  )
  where not sem_identificacao;

comment on index public.cadastro_cto_identificacao_olt_slot_pon_tecnologia_key is
  'Identificação operacional única por combinação de identificacao_cto, OLT, Slot, PON e tecnologia (nula tratada como N/A), exceto quando sem_identificacao.';
