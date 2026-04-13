import { type CadastroCtoRow } from "@/components/dashboard/cto-data-table";
import { DashboardCtoSection } from "@/components/dashboard/dashboard-cto-section";
import { fetchDashboardCtos } from "@/lib/cto/fetch-dashboard-ctos";
import { fetchDashboardMetrics } from "@/lib/cto/fetch-dashboard-metrics";
import { createClient } from "@/lib/supabase/server";

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
    const [{ rows, distinctBkos }, metricRows] = await Promise.all([
      fetchDashboardCtos(supabase, {
        q: searchParams.q,
        cidade: searchParams.cidade,
        tecnico: searchParams.tecnico,
        bko: searchParams.bko,
      }),
      fetchDashboardMetrics(supabase),
    ]);

    const totalCtos = metricRows.length;
    const totalVagasLivres = metricRows.reduce((acc, r) => acc + r.vagas_atuais, 0);
    const criticas = metricRows.filter((r) => r.vagas_atuais <= 1).length;
    const totalPortas = metricRows.reduce((acc, r) => acc + r.capacidade, 0);

    return (
      <DashboardCtoSection
        data={rows as CadastroCtoRow[]}
        distinctBkos={distinctBkos}
        metrics={{
          totalCtos,
          totalVagasLivres,
          criticas,
          totalPortas,
        }}
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
