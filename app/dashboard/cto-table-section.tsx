import { DashboardCtoSection } from "@/components/dashboard/dashboard-cto-section";
import { type CadastroCtoRow } from "@/components/dashboard/cto-data-table";
import { createClient } from "@/lib/supabase/server";

export async function CtoTableSection() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cadastro_cto")
    .select(
      "id, nome_cto, area, primaria_codigo, olt, slot, pon, capacidade, potencia_dbm, ultimo_cleanup, vagas_atuais",
    )
    .order("nome_cto", { ascending: true });

  if (error) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
        Erro ao carregar CTOs: {error.message}
      </p>
    );
  }

  return <DashboardCtoSection data={(data ?? []) as CadastroCtoRow[]} />;
}
