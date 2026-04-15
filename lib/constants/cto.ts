/** Allowed port occupancy statuses (must match DB check on public.lotes_cto.status). */
export const PORT_STATUS = {
  COM_CONTRATO: "Conectado com Contrato",
  SEM_CONTRATO: "Conectado sem Contrato",
  LIVRE_CANCELADO: "Livre - Cancelado",
  LIVRE_MUDANCA_ENDERECO: "Livre - Mudança de Endereço",
  /** Novo equivalente a "Livre" (sem contrato no lote). */
  LIVRE_SEM_QUEDA: "Livre - Sem Queda",
} as const;

export type PortStatus = (typeof PORT_STATUS)[keyof typeof PORT_STATUS];

/** Status em que o número do contrato é obrigatório (alinhamento BKO). */
export function portStatusRequiresContract(status: string): boolean {
  return (
    status === PORT_STATUS.COM_CONTRATO ||
    status === PORT_STATUS.LIVRE_CANCELADO ||
    status === PORT_STATUS.LIVRE_MUDANCA_ENDERECO
  );
}

/** Porta conta como vaga livre no trigger (`vagas_atuais`) e na mensagem ao técnico. */
export function portStatusIsVagaLivre(status: string): boolean {
  return status.startsWith("Livre");
}

export const CTO_CAPACIDADES = [8, 16] as const;

/**
 * Código sugerido no legado quando área era “Primária” genérica (exibição).
 * Novo fluxo: sem área → apenas `primaria_codigo`.
 */
export const AREA_PRIMARIA_CODIGO = "01" as const;

