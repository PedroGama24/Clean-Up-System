import type { SupabaseClient } from "@supabase/supabase-js";

import { PORT_STATUS } from "@/lib/constants/cto";
import { editCtoFormSchema } from "@/lib/validations/edit-cto";

import { resolveBkoNome } from "./resolve-bko-nome";

function parseOptionalInt(s: string | undefined): number | null {
  if (!s?.trim()) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

/**
 * Atualiza cabeçalho da CTO e substitui todos os lotes (delete + insert).
 * A trigger `trg_lotes_recalc_cto` recalcula `vagas_atuais` e `ultimo_cleanup`.
 *
 * Capacidade 16→8: o payload deve trazer só portas 1–8; lotes 9–16 somem no replace.
 * Capacidade 8→16: se vierem só 8 portas, completa 9–16 como Livre antes do insert.
 */
export async function updateCtoWithLotesForUser(
  supabase: SupabaseClient,
  input: unknown,
): Promise<{ success: true } | { error: string }> {
  const parsed = editCtoFormSchema.safeParse(input);
  if (!parsed.success) {
    const msg =
      parsed.error.issues[0]?.message ??
      "Não foi possível validar o formulário.";
    return { error: msg };
  }

  const data = parsed.data;

  const { data: prevRow, error: prevErr } = await supabase
    .from("cadastro_cto")
    .select("capacidade")
    .eq("id", data.id)
    .maybeSingle();

  if (prevErr) {
    return { error: prevErr.message };
  }
  const prevCap = (prevRow?.capacidade ?? data.capacidade) as 8 | 16;

  let portasNormalized = [...data.portas];
  if (prevCap === 8 && data.capacidade === 16 && portasNormalized.length === 8) {
    for (let n = 9; n <= 16; n++) {
      portasNormalized.push({
        numero_porta: n,
        status: PORT_STATUS.LIVRE,
        contrato: "",
      });
    }
  }
  if (prevCap === 16 && data.capacidade === 8) {
    portasNormalized = portasNormalized.filter((p) => p.numero_porta <= 8);
  }

  if (portasNormalized.length !== data.capacidade) {
    return {
      error: "Número de portas não confere com a capacidade selecionada.",
    };
  }

  const slot = parseOptionalInt(data.slot);
  const pon = parseOptionalInt(data.pon);
  const observacoes =
    data.observacoes?.trim() === "" || data.observacoes == null
      ? null
      : data.observacoes.trim();

  const bko_nome = await resolveBkoNome(supabase);

  const { error: updateError } = await supabase
    .from("cadastro_cto")
    .update({
      cidade: data.cidade,
      identificacao_cto: data.identificacao_cto.trim(),
      tecnico_campo: data.tecnico_campo,
      bko_nome,
      observacoes,
      olt: data.olt?.trim() || null,
      slot,
      pon,
      capacidade: data.capacidade,
    })
    .eq("id", data.id);

  if (updateError) {
    return { error: updateError.message };
  }

  const lotes = portasNormalized.map((p) => ({
    cto_id: data.id,
    numero_porta: p.numero_porta,
    status: p.status,
    contrato:
      p.status === PORT_STATUS.COM_CONTRATO ? p.contrato!.trim() : null,
  }));

  const { error: deleteError } = await supabase
    .from("lotes_cto")
    .delete()
    .eq("cto_id", data.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  const { error: insertError } = await supabase.from("lotes_cto").insert(lotes);

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true };
}
