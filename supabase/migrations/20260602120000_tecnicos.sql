-- Técnicos de campo: origem dinâmica para o ComboBox/filtros.
-- cadastro_cto.tecnico_campo continua persistido como texto; esta tabela só
-- alimenta a lista de seleção. Sem FK / sem migração de histórico.

create table public.tecnicos (
  id uuid primary key default gen_random_uuid (),
  nome text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.tecnicos is
  'Lista de técnicos de campo (origem do ComboBox/filtros). Não referenciada por FK em cadastro_cto.';

-- ---------------------------------------------------------------------------
-- Row Level Security — mesmo gate de aprovação das tabelas de CTO
-- ---------------------------------------------------------------------------
alter table public.tecnicos enable row level security;

create policy "tecnicos_select"
  on public.tecnicos for select
  to authenticated
  using (public.is_approved_user ());

create policy "tecnicos_insert"
  on public.tecnicos for insert
  to authenticated
  with check (public.is_approved_user ());

create policy "tecnicos_delete"
  on public.tecnicos for delete
  to authenticated
  using (public.is_approved_user ());

-- ---------------------------------------------------------------------------
-- Seed: nomes atuais de lib/constants/tecnico-campo.ts (evita ComboBox vazio).
-- ---------------------------------------------------------------------------
insert into public.tecnicos (nome)
values
  ('AMERICO DE MELO BROTTO'),
  ('ANDRE ESTEVAM DA CRUZ'),
  ('ENDERSON MEIRELLES DOS SANTOS'),
  ('FRANCISCO DE CAMPOS SERRA JUNIOR'),
  ('MARCUS VINICIUS PANDOLFI'),
  ('JOAO PAULO DE LIMA MACIEL'),
  ('JOSE MAURICIO DA SILVA'),
  ('PAULO ROBERTO DA SILVA'),
  ('WAGNER JOSE GUERREIRO DA SILVA'),
  ('ALEXANDRE PEREIRA DOS SANTOS FILHO'),
  ('Andre Carlos Oliveira Galdino'),
  ('ANDRE LUIZ DA SILVA'),
  ('GIOVANI GONÇALVES DE SOUZA'),
  ('Fabiano Luis Pozzer'),
  ('Luiz Felipe de Jesus Silva'),
  ('Joao Lucas Do Nascimento Mendonca'),
  ('Julio Antonio Carvalho de Cunha'),
  ('MARCIO APARECIDO CRUZ'),
  ('Marcos Vinicius Pires'),
  ('Samuel Braz Silva'),
  ('THIAGO GONCALO SILVA'),
  ('ANDRE COUTINHO RODRIGUES'),
  ('ANDRE LUIZ PERES'),
  ('CARLOS HENRIQUE FONTES DO COUTO'),
  ('Carlos Vinicius Barboza Beserra'),
  ('DEIVID SOARES VIEIRA'),
  ('DOUGLAS PINHEIRO BANDEIRA'),
  ('ERISVALDO BRAGA DOS SANTOS'),
  ('IAGO OLIVEIRA DA SILVA'),
  ('Jesus Luiz Lamon Sodre'),
  ('LEANDRO MONTEIRO TEIXEIRA'),
  ('LEANDRO NEUBANER DE PAULA'),
  ('LENILSON MONTEIRO TEIXEIRA'),
  ('RAFAEL SCARP CARVALHO'),
  ('RONALDO RODRIGO DA SILVA'),
  ('SANDRO LUIZ DE MEDEIROS'),
  ('MAX ROBERTO VENTURA DE FREITAS'),
  ('DOUGLAS DO NASCIMENTO DUTRA')
on conflict (nome) do nothing;
