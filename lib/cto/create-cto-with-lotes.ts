import type { SupabaseClient } from "@supabase/supabase-js";

import { portStatusRequiresContract } from "@/lib/constants/cto";
import { novaCtoFormSchema } from "@/lib/validations/nova-cto";

import { buildCadastroCtoPersistHeader } from "./cadastro-cto-persist-header";
import {
  DUPLICATE_IDENTIFICACAO_CTO_MESSAGE,
  findCadastroCtoDuplicateByIdentificacao,
} from "./check-duplicate-identificacao-cto";
import { resolveBkoNome } from "./resolve-bko-nome";

function parseOptionalInt(s: string | undefined): number | null {
  if (!s?.trim()) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

/**
 * Cria CTO + lotes no Supabase (usa cliente já autenticado por cookies).
 */
export async function createCtoWithLotesForUser(
  supabase: SupabaseClient,
  input: unknown,
): Promise<{ success: true; id: string } | { error: string }> {
  const parsed = novaCtoFormSchema.safeParse(input);
  if (!parsed.success) {
    const msg =
      parsed.error.issues[0]?.message ??
      "Não foi possível validar o formulário.";
    return { error: msg };
  }

  const data = parsed.data;

  const slot = parseOptionalInt(data.slot);
  const pon = parseOptionalInt(data.pon);
  const observacoes =
    data.observacoes?.trim() === "" || data.observacoes == null
      ? null
      : data.observacoes.trim();

  const bko_nome = await resolveBkoNome(supabase);
  const headerExtras = buildCadastroCtoPersistHeader(data);

  const dup = await findCadastroCtoDuplicateByIdentificacao(
    supabase,
    data.cidade,
    headerExtras.identificacao_cto,
  );
  if (dup.duplicate) {
    return { error: dup.message };
  }

  const { data: cto, error: ctoError } = await supabase
    .from("cadastro_cto")
    .insert({
      cidade: data.cidade,
      sem_identificacao: data.semIdentificacao,
      identificacao_cto: headerExtras.identificacao_cto,
      tecnologia: headerExtras.tecnologia,
      possui_cordoaria: headerExtras.possui_cordoaria,
      hw_ct: headerExtras.hw_ct,
      hw_cb: headerExtras.hw_cb,
      hw_cd: headerExtras.hw_cd,
      hw_bk: headerExtras.hw_bk,
      valor_caixa: headerExtras.valor_caixa,
      area_caixa: headerExtras.area_caixa,
      tecnico_campo: data.tecnico_campo,
      bko_nome,
      observacoes,
      olt: data.olt?.trim() || null,
      slot,
      pon,
      capacidade: data.capacidade,
    })
    .select("id")
    .single();

  if (ctoError) {
    if (ctoError.code === "23505") {
      return { error: DUPLICATE_IDENTIFICACAO_CTO_MESSAGE };
    }
    return { error: ctoError.message };
  }

  const lotes = data.portas.map((p) => ({
    cto_id: cto.id,
    numero_porta: p.numero_porta,
    status: p.status,
    contrato: portStatusRequiresContract(p.status)
      ? p.contrato!.trim()
      : null,
  }));

  const { error: lotesError } = await supabase.from("lotes_cto").insert(lotes);

  if (lotesError) {
    await supabase.from("cadastro_cto").delete().eq("id", cto.id);
    return { error: lotesError.message };
  }

  return { success: true, id: cto.id };
}
