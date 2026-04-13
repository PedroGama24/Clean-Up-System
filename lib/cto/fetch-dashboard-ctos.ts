import type { SupabaseClient } from "@supabase/supabase-js";

export type DashboardCtoFilters = {
  q?: string;
  cidade?: string;
  tecnico?: string;
  bko?: string;
};

const SELECT_COLUMNS =
  "id, cidade, identificacao_cto, tecnico_campo, bko_nome, olt, slot, pon, capacidade, ultimo_cleanup, vagas_atuais";

async function loadDistinctBkos(
  supabase: SupabaseClient,
): Promise<string[]> {
  const { data: allBkoRows } = await supabase
    .from("cadastro_cto")
    .select("bko_nome")
    .not("bko_nome", "is", null)
    .order("bko_nome", { ascending: true });

  return [
    ...new Set(
      (allBkoRows ?? [])
        .map((r) => (r as { bko_nome: string }).bko_nome?.trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/**
 * Lista CTOs para o painel com filtros server-side.
 * Busca geral (`q`): identificação CTO OU contrato em lotes_cto.
 */
export async function fetchDashboardCtos(
  supabase: SupabaseClient,
  filters: DashboardCtoFilters,
): Promise<{ rows: unknown[]; distinctBkos: string[] }> {
  const q = filters.q?.trim() ?? "";
  const cidade = filters.cidade?.trim() ?? "";
  const tecnico = filters.tecnico?.trim() ?? "";
  const bko = filters.bko?.trim() ?? "";

  let idFilter: string[] | null = null;
  if (q) {
    const like = `%${q}%`;
    const { data: byIdent } = await supabase
      .from("cadastro_cto")
      .select("id")
      .ilike("identificacao_cto", like);

    const { data: byContract } = await supabase
      .from("lotes_cto")
      .select("cto_id")
      .ilike("contrato", like);

    const ids = new Set<string>();
    for (const r of byIdent ?? []) {
      if (r.id) ids.add(r.id);
    }
    for (const r of byContract ?? []) {
      if (r.cto_id) ids.add(r.cto_id);
    }
    idFilter = [...ids];
    if (idFilter.length === 0) {
      return { rows: [], distinctBkos: await loadDistinctBkos(supabase) };
    }
  }

  let query = supabase
    .from("cadastro_cto")
    .select(SELECT_COLUMNS)
    .order("identificacao_cto", { ascending: true });

  if (idFilter) {
    query = query.in("id", idFilter);
  }
  if (cidade) {
    query = query.eq("cidade", cidade);
  }
  if (tecnico) {
    query = query.eq("tecnico_campo", tecnico);
  }
  if (bko) {
    query = query.eq("bko_nome", bko);
  }

  const { data: rows, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const distinctBkos = await loadDistinctBkos(supabase);

  return { rows: rows ?? [], distinctBkos };
}
