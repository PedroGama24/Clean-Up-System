import type { SupabaseClient } from "@supabase/supabase-js";

import { PORT_STATUS } from "@/lib/constants/cto";
import { editCtoFormSchema } from "@/lib/validations/edit-cto";

function parseOptionalInt(s: string | undefined): number | null {
  if (!s?.trim()) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

/**
 * Atualiza cabeçalho da CTO e substitui todos os lotes (delete + insert).
 * A trigger `trg_lotes_recalc_cto` recalcula `vagas_atuais` e `ultimo_cleanup`.
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

  let area: string | null = null;
  let primaria_codigo: string | null = null;

  if (data.areaOrigem === "codigo_interno") {
    const code = data.areaCodigo?.trim() ?? "";
    area = code.length > 0 ? code : null;
  } else {
    primaria_codigo = data.primariaCodigo!.trim();
  }

  const slot = parseOptionalInt(data.slot);
  const pon = parseOptionalInt(data.pon);
  const potenciaRaw = data.potencia_dbm?.trim();
  const potencia_dbm =
    potenciaRaw === undefined || potenciaRaw === ""
      ? null
      : Number(potenciaRaw);

  const { error: updateError } = await supabase
    .from("cadastro_cto")
    .update({
      nome_cto: data.nome_cto.trim(),
      area,
      primaria_codigo,
      olt: data.olt?.trim() || null,
      slot,
      pon,
      capacidade: data.capacidade,
      potencia_dbm:
        potencia_dbm != null && Number.isFinite(potencia_dbm)
          ? potencia_dbm
          : null,
    })
    .eq("id", data.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return { error: "Já existe uma CTO com este nome." };
    }
    if (
      updateError.message?.includes("primaria_codigo") ||
      updateError.message?.includes("column")
    ) {
      return {
        error:
          "O banco ainda não tem as colunas Primária. Rode a migration em supabase/migrations/20260408120000_cadastro_cto_primaria.sql no SQL Editor.",
      };
    }
    return { error: updateError.message };
  }

  const lotes = data.portas.map((p) => ({
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
