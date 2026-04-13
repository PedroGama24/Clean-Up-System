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
