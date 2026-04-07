/** Allowed port occupancy statuses (must match DB check on public.lotes_cto.status). */
export const PORT_STATUS = {
  COM_CONTRATO: "Conectado com Contrato",
  SEM_CONTRATO: "Conectado sem Contrato",
  LIVRE: "Livre",
} as const;

export type PortStatus = (typeof PORT_STATUS)[keyof typeof PORT_STATUS];

export const CTO_CAPACIDADES = [8, 16] as const;

/**
 * Código sugerido no legado quando área era “Primária” genérica (exibição).
 * Novo fluxo: sem área → apenas `primaria_codigo`.
 */
export const AREA_PRIMARIA_CODIGO = "01" as const;

