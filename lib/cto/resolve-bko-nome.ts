import type { SupabaseClient } from "@supabase/supabase-js";

/** Nome do BKO autenticado para rastreabilidade em cadastro_cto.bko_nome. */
export async function resolveBkoNome(
  supabase: SupabaseClient,
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "—";
  }
  const { data } = await supabase
    .from("profiles")
    .select("nome_completo, email")
    .eq("id", user.id)
    .maybeSingle();

  const nome = data?.nome_completo?.trim();
  if (nome) {
    return nome;
  }
  const email = (data?.email ?? user.email ?? "").trim();
  return email || "—";
}
