import { type CadastroCtoRow } from "@/components/dashboard/cto-data-table";
import { DashboardCtoSection } from "@/components/dashboard/dashboard-cto-section";
import { fetchDashboardCtos } from "@/lib/cto/fetch-dashboard-ctos";
import { createClient } from "@/lib/supabase/server";
import { fetchTecnicoNomes } from "@/lib/tecnicos/queries";

export type DashboardSearchParams = {
  q?: string;
  cidade?: string;
  tecnico?: string;
  bko?: string;
};

export async function CtoTableSection({
  searchParams = {},
}: {
  searchParams?: DashboardSearchParams;
}) {
  const supabase = await createClient();

  try {
    const [{ rows, distinctBkos }, tecnicos] = await Promise.all([
      fetchDashboardCtos(supabase, {
        q: searchParams.q,
        cidade: searchParams.cidade,
        tecnico: searchParams.tecnico,
        bko: searchParams.bko,
      }),
      fetchTecnicoNomes(supabase),
    ]);

    return (
      <DashboardCtoSection
        data={rows as CadastroCtoRow[]}
        distinctBkos={distinctBkos}
        tecnicos={tecnicos}
      />
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
        Erro ao carregar CTOs: {message}
      </p>
    );
  }
}
