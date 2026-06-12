export type DashboardMetricsInput = {
  capacidade: number;
  vagas_atuais: number;
};

export type DashboardMetrics = {
  totalCtos: number;
  totalVagasLivres: number;
  criticas: number;
  totalPortas: number;
};

/**
 * Deriva os 4 KPIs do dashboard a partir do mesmo conjunto de linhas que
 * alimenta a tabela de CTOs. Helper puro reutilizado no server (filtros de URL)
 * e no client (quick filter "CTOs críticas").
 */
export function computeDashboardMetrics(
  rows: DashboardMetricsInput[],
): DashboardMetrics {
  return {
    totalCtos: rows.length,
    totalVagasLivres: rows.reduce((acc, r) => acc + r.vagas_atuais, 0),
    criticas: rows.filter((r) => r.vagas_atuais <= 1).length,
    totalPortas: rows.reduce((acc, r) => acc + r.capacidade, 0),
  };
}
