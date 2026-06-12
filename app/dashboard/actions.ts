"use server";

import {
  fetchAllCtosForExport,
  type CtoExportRow,
} from "@/lib/cto/fetch-all-ctos-for-export";
import { createClient } from "@/lib/supabase/server";

/**
 * Retorna a base completa de CTOs para exportação CSV (ignora filtros do dashboard).
 * Exige sessão autenticada, seguindo o padrão das demais Server Actions.
 */
export async function exportAllCtosAction(): Promise<
  { success: true; rows: CtoExportRow[] } | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessão expirada ou não autenticado. Entre novamente." };
  }

  try {
    const rows = await fetchAllCtosForExport(supabase);
    return { success: true, rows };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erro desconhecido ao exportar.";
    return { error: message };
  }
}
