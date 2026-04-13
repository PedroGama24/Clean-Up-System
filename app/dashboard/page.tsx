import Link from "next/link";
import { Suspense } from "react";

import { CtoTableSection } from "@/app/dashboard/cto-table-section";
import type { DashboardSearchParams } from "@/app/dashboard/cto-table-section";
import { CtoTableSkeleton } from "@/app/dashboard/cto-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<DashboardSearchParams>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const suspenseKey = [
    sp.q ?? "",
    sp.cidade ?? "",
    sp.tecnico ?? "",
    sp.bko ?? "",
  ].join("|");

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-md shadow-black/[0.03] ring-1 ring-border/40 backdrop-blur-sm sm:p-8 dark:shadow-black/25">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Painel
            </p>
            <h1 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
              Caixas de terminação óptica
            </h1>
            <p className="max-w-xl text-muted-foreground text-sm leading-relaxed sm:text-[0.9375rem]">
              Listagem com ocupação, vagas livres e último clean up. Use os
              filtros por cidade, técnico e BKO, e a busca geral para localizar
              por identificação da CTO ou número de contrato.
            </p>
          </div>
          <Link
            href="/dashboard/nova-cto"
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex h-11 w-full shrink-0 justify-center font-medium shadow-sm sm:w-auto sm:min-w-[11rem]",
            )}
          >
            Novo clean up
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/30 p-1 shadow-sm ring-1 ring-border/30 sm:p-1.5 dark:bg-card/20">
        <div className="rounded-xl bg-background/60 p-3 sm:p-4 dark:bg-background/40">
          <Suspense key={suspenseKey} fallback={<CtoTableSkeleton />}>
            <CtoTableSection searchParams={sp} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
