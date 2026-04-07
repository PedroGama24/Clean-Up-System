"use server";

import { revalidatePath } from "next/cache";

import { updateCtoWithLotesForUser } from "@/lib/cto/update-cto-with-lotes";
import { createClient } from "@/lib/supabase/server";
import type { EditCtoFormValues } from "@/lib/validations/edit-cto";

export async function updateCtoAction(
  values: EditCtoFormValues,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessão expirada ou não autenticado. Entre novamente." };
  }

  const result = await updateCtoWithLotesForUser(supabase, values);

  if ("success" in result && result.success) {
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/cto/${values.id}`);
    return { success: true };
  }

  return result;
}
