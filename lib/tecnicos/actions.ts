"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { fetchTecnicos, type Tecnico } from "@/lib/tecnicos/queries";

const SESSION_EXPIRED = "Sessão expirada ou não autenticado. Entre novamente.";

export async function getTecnicos(): Promise<Tecnico[]> {
  const supabase = await createClient();
  return fetchTecnicos(supabase);
}

export async function createTecnico(
  nome: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: SESSION_EXPIRED };
  }

  const nomeNormalizado = nome.trim();
  if (!nomeNormalizado) {
    return { error: "Informe o nome do técnico." };
  }

  const { error } = await supabase
    .from("tecnicos")
    .insert({ nome: nomeNormalizado });

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um técnico com esse nome." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/tecnicos");
  return { success: true };
}

export async function deleteTecnico(
  id: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: SESSION_EXPIRED };
  }

  if (!id) {
    return { error: "Técnico inválido." };
  }

  const { error } = await supabase.from("tecnicos").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/tecnicos");
  return { success: true };
}
