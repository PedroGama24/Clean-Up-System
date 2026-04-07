import Link from "next/link";
import { Suspense } from "react";

import { CtoTableSection } from "@/app/dashboard/cto-table-section";
import { CtoTableSkeleton } from "@/app/dashboard/cto-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl tracking-tight">CTOs</h1>
          <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
            Listagem das caixas de terminação óptica com ocupação e último
            clean up registrado.
          </p>
        </div>
        <Link
          href="/dashboard/nova-cto"
          className={cn(
            buttonVariants({ variant: "default" }),
            "inline-flex w-full justify-center sm:w-auto",
          )}
        >
          Novo Clean Up
        </Link>
      </div>

      <Suspense fallback={<CtoTableSkeleton />}>
        <CtoTableSection />
      </Suspense>
    </div>
  );
}
