import type { SupabaseClient } from "@supabase/supabase-js";

export type HistoricoCtoItem = {
  id: string;
  cto_id: string;
  bko_nome: string;
  acao: string;
  contrato: string | null;
  created_at: string;
};

/**
 * Registros de `historico_cto` de uma CTO, do mais recente para o mais antigo.
 */
export async function getHistoricoCto(
  supabase: SupabaseClient,
  ctoId: string,
): Promise<{ data: HistoricoCtoItem[]; error: string | null }> {
  const { data, error } = await supabase
    .from("historico_cto")
    .select("id, cto_id, bko_nome, acao, contrato, created_at")
    .eq("cto_id", ctoId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as HistoricoCtoItem[], error: null };
}
