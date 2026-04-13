import Link from "next/link";
import { notFound } from "next/navigation";

import { EditCtoForm } from "@/components/dashboard/edit-cto-form";
import { buttonVariants } from "@/components/ui/button";
import { buildEditFormDefaults } from "@/lib/cto/build-edit-form-defaults";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mensagem?: string }>;
};

export default async function EditCtoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { mensagem } = await searchParams;
  const autoOpenTecnicoDialog = mensagem === "1";
  const supabase = await createClient();

  const { data: cto, error: ctoError } = await supabase
    .from("cadastro_cto")
    .select(
      "id, cidade, identificacao_cto, tecnico_campo, bko_nome, observacoes, olt, slot, pon, capacidade",
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
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-md shadow-black/[0.03] ring-1 ring-border/40 backdrop-blur-sm sm:p-8 dark:shadow-black/25">
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Auditoria
          </p>
          <h1 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
            Atualizar Auditoria da CTO
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-[0.9375rem]">
            <span className="font-medium text-foreground">
              {cto.identificacao_cto}
            </span>
            {" — "}
            <span className="text-muted-foreground">{cto.cidade}</span>
            {" — "}
            Altere apenas o status das portas que sofreram mudança e clique em
            Salvar para registrar o Clean Up de hoje. As vagas livres são
            recalculadas automaticamente ao salvar. Use{" "}
            <span className="font-medium text-foreground">
              Gerar Mensagem para Técnico
            </span>{" "}
            para copiar o texto do WhatsApp.
          </p>
        </div>
      </section>
      <EditCtoForm
        defaultValues={defaults}
        autoOpenTecnicoDialog={autoOpenTecnicoDialog}
      />
    </div>
  );
}
