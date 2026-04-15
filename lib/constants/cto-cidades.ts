/**
 * Cidades com regra SP: select de tecnologia (HW / FH / NK) e fluxo condicional
 * de identificação da CTO.
 */
export const CTO_CIDADES_COM_TECNOLOGIA_SP = [
  "CGT",
  "SST",
  "IBL",
  "SSTBO",
] as const;

export function isCidadeComTecnologiaSp(cidade: string): boolean {
  return (CTO_CIDADES_COM_TECNOLOGIA_SP as readonly string[]).includes(cidade);
}

/** Cidades permitidas no cadastro (Select estrito). */
export const CTO_CIDADES = [
  "BMA",
  "BPI",
  "COLG",
  "IZA",
  "MPE",
  "PDS",
  "PFS",
  "PNDO",
  "PNHE",
  "PORE",
  "RSD",
  "TRS",
  "VAS",
  "VLC",
  "VRD",
  "CGT",
  "SST",
  "IBL",
  "SSTBO",
] as const;

export type CtoCidade = (typeof CTO_CIDADES)[number];
