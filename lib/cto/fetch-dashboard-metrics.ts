import type { SupabaseClient } from "@supabase/supabase-js";

export type DashboardMetricRow = {
  capacidade: number;
  vagas_atuais: number;
};

export async function fetchDashboardMetrics(
  supabase: SupabaseClient,
): Promise<DashboardMetricRow[]> {
  const { data, error } = await supabase
    .from("cadastro_cto")
    .select("capacidade, vagas_atuais");

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as DashboardMetricRow[];
}
