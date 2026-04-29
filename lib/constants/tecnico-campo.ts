/** Lista fixa de técnicos de campo (Combobox pesquisável). */
export const TECNICOS_CAMPO = [
  "AMERICO DE MELO BROTTO",
  "ANDRE ESTEVAM DA CRUZ",
  "ENDERSON MEIRELLES DOS SANTOS",
  "FRANCISCO DE CAMPOS SERRA JUNIOR",
  "MARCUS VINICIUS PANDOLFI",
  "JOAO PAULO DE LIMA MACIEL",
  "JOSE MAURICIO DA SILVA",
  "PAULO ROBERTO DA SILVA",
  "WAGNER JOSE GUERREIRO DA SILVA",
  "ALEXANDRE PEREIRA DOS SANTOS FILHO",
  "Andre Carlos Oliveira Galdino",
  "ANDRE LUIZ DA SILVA",
  "GIOVANI GONÇALVES DE SOUZA",
  "Fabiano Luis Pozzer",
  "Luiz Felipe de Jesus Silva",
  "Joao Lucas Do Nascimento Mendonca",
  "Julio Antonio Carvalho de Cunha",
  "MARCIO APARECIDO CRUZ",
  "Marcos Vinicius Pires",
  "Samuel Braz Silva",
  "THIAGO GONCALO SILVA",
  "ANDRE COUTINHO RODRIGUES",
  "ANDRE LUIZ PERES",
  "CARLOS HENRIQUE FONTES DO COUTO",
  "Carlos Vinicius Barboza Beserra",
  "DEIVID SOARES VIEIRA",
  "DOUGLAS PINHEIRO BANDEIRA",
  "ERISVALDO BRAGA DOS SANTOS",
  "IAGO OLIVEIRA DA SILVA",
  "Jesus Luiz Lamon Sodre",
  "LEANDRO MONTEIRO TEIXEIRA",
  "LEANDRO NEUBANER DE PAULA",
  "LENILSON MONTEIRO TEIXEIRA",
  "RAFAEL SCARP CARVALHO",
  "RONALDO RODRIGO DA SILVA",
  "SANDRO LUIZ DE MEDEIROS",
  "DOUGLAS DO NASCIMENTO DUTRA",
] as const;

export type TecnicoCampo = (typeof TECNICOS_CAMPO)[number];

const set = new Set<string>(TECNICOS_CAMPO);

export function isTecnicoCampo(value: string): boolean {
  return set.has(value);
}
