import type { SupabaseClient } from "@supabase/supabase-js";

export type Tecnico = {
  id: string;
  nome: string;
  created_at: string;
};

/** Lista técnicos ordenados alfabeticamente por nome. */
export async function fetchTecnicos(
  supabase: SupabaseClient,
): Promise<Tecnico[]> {
  const { data, error } = await supabase
    .from("tecnicos")
    .select("id, nome, created_at")
    .order("nome", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Tecnico[];
}

/** Apenas os nomes (para ComboBox e filtros). */
export async function fetchTecnicoNomes(
  supabase: SupabaseClient,
): Promise<string[]> {
  const tecnicos = await fetchTecnicos(supabase);
  return tecnicos.map((t) => t.nome);
}

/** Verifica se um nome existe na base (comparação exata, já normalizada por trim). */
export async function tecnicoExists(
  supabase: SupabaseClient,
  nome: string,
): Promise<boolean> {
  const alvo = nome.trim();
  if (!alvo) return false;

  const { data, error } = await supabase
    .from("tecnicos")
    .select("id")
    .eq("nome", alvo)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data != null;
}
