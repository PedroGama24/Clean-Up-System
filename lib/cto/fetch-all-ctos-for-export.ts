import type { SupabaseClient } from "@supabase/supabase-js";

/** Linha completa de `cadastro_cto` usada na exportação CSV (cabeçalho, sem lotes). */
export type CtoExportRow = {
  identificacao_cto: string | null;
  cidade: string | null;
  bairro: string | null;
  rua: string | null;
  tecnico_campo: string | null;
  contrato: string | null;
  olt: string | null;
  slot: number | null;
  pon: number | null;
  ultimo_cleanup: string | null;
  tecnologia: string | null;
  capacidade: number | null;
  vagas_atuais: number | null;
  bko_nome: string | null;
  observacoes: string | null;
  sem_identificacao: boolean | null;
  possui_cordoaria: boolean | null;
  hw_ct: string | null;
  hw_cb: string | null;
  hw_cd: string | null;
  hw_bk: string | null;
  valor_caixa: string | null;
  area_caixa: string | null;
};

const EXPORT_COLUMNS =
  "identificacao_cto, cidade, bairro, rua, tecnico_campo, contrato, olt, slot, pon, ultimo_cleanup, tecnologia, capacidade, vagas_atuais, bko_nome, observacoes, sem_identificacao, possui_cordoaria, hw_ct, hw_cb, hw_cd, hw_bk, valor_caixa, area_caixa";

/**
 * Busca TODOS os registros de `cadastro_cto` para exportação (dump integral).
 * Não aplica filtros de URL (q/cidade/tecnico/bko) nem `.limit()`.
 */
export async function fetchAllCtosForExport(
  supabase: SupabaseClient,
): Promise<CtoExportRow[]> {
  const { data, error } = await supabase
    .from("cadastro_cto")
    .select(EXPORT_COLUMNS)
    .order("cidade", { ascending: true })
    .order("identificacao_cto", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CtoExportRow[];
}
