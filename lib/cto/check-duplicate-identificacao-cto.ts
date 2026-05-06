import type { SupabaseClient } from "@supabase/supabase-js";

const MSG_DUPLICATA =
  "Já existe uma CTO com esta combinação de identificação, OLT, Slot, PON e tecnologia. Ajuste os dados ou edite o cadastro existente.";

type DuplicateLookupInput = {
  identificacaoCto: string;
  olt: string;
  slot: string;
  pon: string;
  tecnologia?: string | null;
  excludeCtoId?: string;
};

function parseOptionalInt(s: string | undefined): number | null {
  if (!s?.trim()) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

function normalizeTecnologia(
  tecnologia: string | null | undefined,
): string | null {
  const t = tecnologia?.trim() ?? "";
  return t === "" ? null : t;
}

/**
 * Verifica se já existe outra linha com a mesma combinação operacional.
 */
export async function findCadastroCtoDuplicateByIdentificacao(
  supabase: SupabaseClient,
  input: DuplicateLookupInput,
): Promise<{ duplicate: true; message: string } | { duplicate: false }> {
  const key = input.identificacaoCto.trim();
  if (!key) {
    return { duplicate: false };
  }
  if (key === "Sem Identificação") {
    return { duplicate: false };
  }
  const olt = input.olt.trim();
  const slot = parseOptionalInt(input.slot);
  const pon = parseOptionalInt(input.pon);
  if (!olt || slot == null || pon == null) {
    return { duplicate: false };
  }
  const tecnologia = normalizeTecnologia(input.tecnologia);

  let q = supabase
    .from("cadastro_cto")
    .select("id")
    .eq("identificacao_cto", key)
    .eq("olt", olt)
    .eq("slot", slot)
    .eq("pon", pon)
    .limit(1);

  if (tecnologia != null) {
    q = q.eq("tecnologia", tecnologia);
  } else {
    q = q.is("tecnologia", null);
  }

  if (input.excludeCtoId) {
    q = q.neq("id", input.excludeCtoId);
  }

  const { data: rows, error } = await q;
  if (error) {
    return { duplicate: false };
  }
  if (rows?.length) {
    return { duplicate: true, message: MSG_DUPLICATA };
  }

  if (tecnologia == null) {
    // Compatibilidade com dados legados que eventualmente gravaram string vazia.
    let qLegacy = supabase
      .from("cadastro_cto")
      .select("id")
      .eq("identificacao_cto", key)
      .eq("olt", olt)
      .eq("slot", slot)
      .eq("pon", pon)
      .eq("tecnologia", "")
      .limit(1);

    if (input.excludeCtoId) {
      qLegacy = qLegacy.neq("id", input.excludeCtoId);
    }

    const { data: legacyRows, error: legacyError } = await qLegacy;
    if (!legacyError && legacyRows?.length) {
      return { duplicate: true, message: MSG_DUPLICATA };
    }
  }

  return { duplicate: false };
}

export const DUPLICATE_IDENTIFICACAO_CTO_MESSAGE = MSG_DUPLICATA;
