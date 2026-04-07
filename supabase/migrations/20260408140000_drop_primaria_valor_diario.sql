-- Valor diário (Primária) removido do produto; só permanece código de referência.
alter table public.cadastro_cto
  drop column if exists primaria_valor_diario;
