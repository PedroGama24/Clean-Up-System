-- Impede duas CTOs com a mesma identificação na mesma cidade (chave operacional do painel).
create unique index if not exists cadastro_cto_cidade_identificacao_cto_key
  on public.cadastro_cto (cidade, identificacao_cto);

comment on index public.cadastro_cto_cidade_identificacao_cto_key is
  'Uma identificação de CTO é única por cidade.';
