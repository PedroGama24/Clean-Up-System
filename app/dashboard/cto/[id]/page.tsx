import Link from "next/link";
import { notFound } from "next/navigation";

import { EditCtoForm } from "@/components/dashboard/edit-cto-form";
import { buttonVariants } from "@/components/ui/button";
import { buildEditFormDefaults } from "@/lib/cto/build-edit-form-defaults";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCtoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cto, error: ctoError } = await supabase
    .from("cadastro_cto")
    .select(
      "id, nome_cto, area, primaria_codigo, olt, slot, pon, capacidade, potencia_dbm",
    )
    .eq("id", id)
    .maybeSingle();

  if (ctoError || !cto) {
    notFound();
  }

  const { data: lotes, error: lotesError } = await supabase
    .from("lotes_cto")
    .select("numero_porta, status, contrato")
    .eq("cto_id", id)
    .order("numero_porta", { ascending: true });

  if (lotesError) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Voltar ao painel
        </Link>
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          Erro ao carregar portas: {lotesError.message}
        </p>
      </div>
    );
  }

  const lotesList = lotes ?? [];
  if (lotesList.length !== cto.capacidade) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Voltar ao painel
        </Link>
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-amber-950 text-sm dark:text-amber-100">
          Dados incompletos: esta CTO tem capacidade {cto.capacidade} portas, mas{" "}
          {lotesList.length} registro(s) em lotes. Corrija no banco antes de editar.
        </p>
      </div>
    );
  }

  const defaults = buildEditFormDefaults(cto, lotesList);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">
          Atualizar Auditoria da CTO
        </h1>
        <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
          <span className="font-medium text-foreground">{cto.nome_cto}</span>
          {" — "}
          Altere apenas o status das portas que sofreram mudança e clique em
          Salvar para registrar o Clean Up de hoje. As vagas livres são
          recalculadas automaticamente ao salvar.
        </p>
      </div>
      <EditCtoForm defaultValues={defaults} />
    </div>
  );
}
