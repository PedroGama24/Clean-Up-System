import { TecnicosManager } from "@/components/dashboard/tecnicos-manager";
import { fetchTecnicos } from "@/lib/tecnicos/queries";
import { createClient } from "@/lib/supabase/server";

export default async function TecnicosPage() {
  const supabase = await createClient();

  let tecnicos = [] as Awaited<ReturnType<typeof fetchTecnicos>>;
  let errorMessage: string | null = null;

  try {
    tecnicos = await fetchTecnicos(supabase);
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : "Erro desconhecido";
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-md shadow-black/[0.03] ring-1 ring-border/40 backdrop-blur-sm sm:p-8 dark:shadow-black/25">
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Cadastros
          </p>
          <h1 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
            Gestão de Técnicos
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-[0.9375rem]">
            Gerencie a lista de técnicos de campo. Os nomes cadastrados aqui
            alimentam o seletor de técnico nos formulários de CTO e o filtro do
            painel.
          </p>
        </div>
      </section>

      {errorMessage ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          Erro ao carregar técnicos: {errorMessage}
        </p>
      ) : (
        <TecnicosManager tecnicos={tecnicos} />
      )}
    </div>
  );
}
