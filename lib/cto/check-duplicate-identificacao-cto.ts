import type { SupabaseClient } from "@supabase/supabase-js";

const MSG_DUPLICATA =
  "Já existe uma CTO com esta identificação nesta cidade. Altere a identificação ou edite o cadastro existente.";

/**
 * Verifica se já existe outra linha com o mesmo par cidade + identificação resolvida.
 */
export async function findCadastroCtoDuplicateByIdentificacao(
  supabase: SupabaseClient,
  cidade: string,
  identificacaoCto: string,
  excludeCtoId?: string,
): Promise<{ duplicate: true; message: string } | { duplicate: false }> {
  const key = identificacaoCto.trim();
  if (!key) {
    return { duplicate: false };
  }

  let q = supabase
    .from("cadastro_cto")
    .select("id")
    .eq("cidade", cidade)
    .eq("identificacao_cto", key)
    .limit(1);

  if (excludeCtoId) {
    q = q.neq("id", excludeCtoId);
  }

  const { data: rows, error } = await q;

  if (error || !rows?.length) {
    return { duplicate: false };
  }

  return { duplicate: true, message: MSG_DUPLICATA };
}

export const DUPLICATE_IDENTIFICACAO_CTO_MESSAGE = MSG_DUPLICATA;
