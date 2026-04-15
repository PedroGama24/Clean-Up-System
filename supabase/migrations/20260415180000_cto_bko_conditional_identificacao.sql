-- BKO alinhamento: campos condicionais no cadastro CTO, novos status de portas,
-- vagas_atuais conta qualquer status que comece com "Livre".

-- ---------------------------------------------------------------------------
-- cadastro_cto: colunas para fluxos SP (tecnologia / HW / cordoaria) e demais cidades (caixa)
-- ---------------------------------------------------------------------------
alter table public.cadastro_cto
  add column if not exists tecnologia text,
  add column if not exists possui_cordoaria boolean,
  add column if not exists hw_ct text,
  add column if not exists hw_cb text,
  add column if not exists hw_cd text,
  add column if not exists hw_bk text,
  add column if not exists valor_caixa text,
  add column if not exists area_caixa text;

comment on column public.cadastro_cto.tecnologia is 'HW | FH | NK (cidades com regra SP no app).';
comment on column public.cadastro_cto.possui_cordoaria is 'Preenchido quando tecnologia NK.';
comment on column public.cadastro_cto.hw_ct is 'Identificação HW — componente CT.';
comment on column public.cadastro_cto.hw_cb is 'Identificação HW — componente CB.';
comment on column public.cadastro_cto.hw_cd is 'Identificação HW — componente CD.';
comment on column public.cadastro_cto.hw_bk is 'Identificação HW — componente BK.';
comment on column public.cadastro_cto.valor_caixa is 'Regra demais cidades — valor da caixa.';
comment on column public.cadastro_cto.area_caixa is 'Regra demais cidades — área da caixa.';

-- ---------------------------------------------------------------------------
-- lotes_cto: substituir status "Livre" e regras de contrato
-- Ordem obrigatória: remover o CHECK legado antes do UPDATE — o antigo só
-- aceitava exatamente 'Livre', não 'Livre - Sem Queda'.
-- ---------------------------------------------------------------------------
alter table public.lotes_cto
  drop constraint if exists lotes_cto_status_check;

update public.lotes_cto
set status = 'Livre - Sem Queda'
where status = 'Livre';

alter table public.lotes_cto
  add constraint lotes_cto_status_check check (
    status in (
      'Conectado com Contrato',
      'Conectado sem Contrato',
      'Livre - Cancelado',
      'Livre - Mudança de Endereço',
      'Livre - Sem Queda'
    )
  );

alter table public.lotes_cto
  drop constraint if exists lotes_cto_contrato_when_contracted;

alter table public.lotes_cto
  drop constraint if exists lotes_cto_contrato_only_when_needed;

alter table public.lotes_cto
  add constraint lotes_cto_contrato_when_needed check (
    case
      when status in (
        'Conectado com Contrato',
        'Livre - Cancelado',
        'Livre - Mudança de Endereço'
      ) then
        contrato is not null
        and length(trim(contrato)) > 0
      else true
    end
  );

alter table public.lotes_cto
  add constraint lotes_cto_contrato_only_when_needed check (
    case
      when status in (
        'Conectado com Contrato',
        'Livre - Cancelado',
        'Livre - Mudança de Endereço'
      ) then true
      else contrato is null or length(trim(contrato)) = 0
    end
  );

-- ---------------------------------------------------------------------------
-- Trigger: vagas livres = qualquer porta com status LIKE 'Livre%'
-- ---------------------------------------------------------------------------
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
        and l.status like 'Livre%'
    ),
    ultimo_cleanup = now()
  where c.id = target;
  return coalesce(new, old);
end;
$$;

-- Recalcula cabeçalhos já existentes (trigger só roda em mudança em lotes_cto)
update public.cadastro_cto c
set
  vagas_atuais = (
    select count(*)::integer
    from public.lotes_cto l
    where l.cto_id = c.id
      and l.status like 'Livre%'
  );
