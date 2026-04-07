"use client";

import { FilterX } from "lucide-react";
import { useMemo, useState } from "react";

import { CtoDataTable, type CadastroCtoRow } from "@/components/dashboard/cto-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAreaColumn } from "@/lib/area-display";
import { cn } from "@/lib/utils";

function rowMatchesSearch(row: CadastroCtoRow, q: string): boolean {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  if (row.nome_cto.toLowerCase().includes(t)) return true;
  if (row.area?.toLowerCase().includes(t)) return true;
  if (row.primaria_codigo?.toLowerCase().includes(t)) return true;
  if (formatAreaColumn(row).toLowerCase().includes(t)) return true;
  if (row.olt?.toLowerCase().includes(t)) return true;
  return false;
}

type QuickFilter = "none" | "criticas";

type DashboardCtoSectionProps = {
  data: CadastroCtoRow[];
};

export function DashboardCtoSection({ data }: DashboardCtoSectionProps) {
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("none");

  const afterSearch = useMemo(
    () => data.filter((row) => rowMatchesSearch(row, search)),
    [data, search],
  );

  const filtered = useMemo(() => {
    if (quickFilter === "criticas") {
      return afterSearch.filter((row) => row.vagas_atuais <= 1);
    }
    return afterSearch;
  }, [afterSearch, quickFilter]);

  const hasActiveFilters =
    search.trim() !== "" || quickFilter === "criticas";

  function clearAllFilters() {
    setSearch("");
    setQuickFilter("none");
  }

  function toggleCriticasFilter() {
    setQuickFilter((prev) => (prev === "criticas" ? "none" : "criticas"));
  }

  const metrics = useMemo(() => {
    const totalCtos = data.length;
    const totalVagasLivres = data.reduce((acc, r) => acc + r.vagas_atuais, 0);
    const criticas = data.filter((r) => r.vagas_atuais <= 1).length;
    const totalPortas = data.reduce((acc, r) => acc + r.capacidade, 0);
    return { totalCtos, totalVagasLivres, criticas, totalPortas };
  }, [data]);

  const cardInteractiveClass =
    "cursor-pointer transition-colors hover:border-ring/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          role="button"
          tabIndex={0}
          className={cardInteractiveClass}
          onClick={clearAllFilters}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              clearAllFilters();
            }
          }}
          aria-label="Mostrar todas as CTOs e limpar filtros"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              CTOs auditadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-3xl tabular-nums tracking-tight">
              {metrics.totalCtos}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              Caixas registradas no sistema — clique para ver todas
            </p>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          className={cardInteractiveClass}
          onClick={() => setQuickFilter("none")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setQuickFilter("none");
            }
          }}
          aria-label="Remover filtro de CTOs críticas"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Vagas livres na rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-3xl tabular-nums tracking-tight">
              {metrics.totalVagasLivres}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              Soma das vagas atuais (status Livre)
            </p>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          className={cn(
            cardInteractiveClass,
            quickFilter === "criticas" &&
              "border-primary/60 bg-primary/5 ring-2 ring-primary/30",
          )}
          onClick={toggleCriticasFilter}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleCriticasFilter();
            }
          }}
          aria-pressed={quickFilter === "criticas"}
          aria-label="Filtrar tabela por CTOs críticas (0 ou 1 vaga livre)"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              CTOs críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-3xl tabular-nums tracking-tight">
              {metrics.criticas}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              Com 0 ou 1 vaga livre — clique para filtrar
            </p>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          className={cardInteractiveClass}
          onClick={() => setQuickFilter("none")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setQuickFilter("none");
            }
          }}
          aria-label="Remover filtro de CTOs críticas"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Portas na rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-3xl tabular-nums tracking-tight">
              {metrics.totalPortas}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              Capacidade total das CTOs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="max-w-md flex-1 space-y-2">
            <Label htmlFor="cto-search">Busca</Label>
            <Input
              id="cto-search"
              placeholder="Nome da CTO, área, Primária ou OLT…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={clearAllFilters}
            >
              <FilterX className="size-4" aria-hidden />
              Limpar Filtro
            </Button>
          ) : null}
        </div>

        {data.length > 0 && filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/40 px-6 py-10 text-center">
            <p className="text-muted-foreground text-sm">
              Nenhuma CTO corresponde aos filtros atuais.
            </p>
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-2"
                onClick={clearAllFilters}
              >
                Limpar filtros
              </Button>
            ) : null}
          </div>
        ) : (
          <CtoDataTable data={filtered} showRowActions />
        )}
      </div>
    </div>
  );
}
