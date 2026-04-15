"use client";

import { FilterX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { CtoDataTable, type CadastroCtoRow } from "@/components/dashboard/cto-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CTO_CIDADES } from "@/lib/constants/cto-cidades";
import { TECNICOS_CAMPO } from "@/lib/constants/tecnico-campo";
import { cn } from "@/lib/utils";

/** Valor interno do item “sem filtro”; o rótulo exibido é sempre “Todas”/“Todos”. */
const ALL = "__all__";

function FacetTriggerLabel({
  value,
  emptyLabel,
}: {
  value: string;
  emptyLabel: string;
}) {
  return (
    <span
      data-slot="select-value"
      className={cn(
        "line-clamp-1 flex flex-1 text-left",
        !value && "text-muted-foreground",
      )}
    >
      {value || emptyLabel}
    </span>
  );
}

type QuickFilter = "none" | "criticas";

type DashboardCtoSectionProps = {
  data: CadastroCtoRow[];
  distinctBkos: string[];
  metrics: {
    totalCtos: number;
    totalVagasLivres: number;
    criticas: number;
    totalPortas: number;
  };
};

function useFilterQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function pushFilters(next: Record<string, string | undefined | null>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value == null || String(value).trim() === "") {
        sp.delete(key);
      } else {
        sp.set(key, String(value).trim());
      }
    }
    const qs = sp.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  return { searchParams, pushFilters, pending };
}

export function DashboardCtoSection({
  data,
  distinctBkos,
  metrics,
}: DashboardCtoSectionProps) {
  const { searchParams, pushFilters, pending } = useFilterQuery();
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("none");

  const q = searchParams.get("q") ?? "";
  const cidade = searchParams.get("cidade") ?? "";
  const tecnico = searchParams.get("tecnico") ?? "";
  const bko = searchParams.get("bko") ?? "";

  const filtered = useMemo(() => {
    if (quickFilter === "criticas") {
      return data.filter((row) => row.vagas_atuais <= 1);
    }
    return data;
  }, [data, quickFilter]);

  const hasFacetFilters = cidade !== "" || tecnico !== "" || bko !== "";
  const hasActiveFilters =
    q.trim() !== "" || hasFacetFilters || quickFilter === "criticas";

  function clearAllFilters() {
    setQuickFilter("none");
    pushFilters({ q: undefined, cidade: undefined, tecnico: undefined, bko: undefined });
  }

  function toggleCriticasFilter() {
    setQuickFilter((prev) => (prev === "criticas" ? "none" : "criticas"));
  }

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
              Soma das vagas atuais (portas com status começando em Livre)
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

      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/10 p-4 sm:p-5">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Filtros
        </p>
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="filter-cidade">Cidade</Label>
            <Select
              value={cidade || ALL}
              onValueChange={(v) =>
                pushFilters({ cidade: v === ALL ? undefined : v })
              }
              disabled={pending}
            >
              <SelectTrigger id="filter-cidade" className="h-8 w-full" size="default">
                <FacetTriggerLabel value={cidade} emptyLabel="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {CTO_CIDADES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-tecnico">Técnico</Label>
            <Select
              value={tecnico || ALL}
              onValueChange={(v) =>
                pushFilters({ tecnico: v === ALL ? undefined : v })
              }
              disabled={pending}
            >
              <SelectTrigger id="filter-tecnico" className="h-8 w-full" size="default">
                <FacetTriggerLabel value={tecnico} emptyLabel="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                {TECNICOS_CAMPO.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-bko">BKO</Label>
            <Select
              value={bko || ALL}
              onValueChange={(v) =>
                pushFilters({ bko: v === ALL ? undefined : v })
              }
              disabled={pending}
            >
              <SelectTrigger id="filter-bko" className="h-8 w-full" size="default">
                <FacetTriggerLabel value={bko} emptyLabel="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                {distinctBkos.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 lg:col-span-1">
            <Label htmlFor="cto-search">Busca geral</Label>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const raw = String(fd.get("q") ?? "");
                pushFilters({ q: raw.trim() === "" ? undefined : raw });
              }}
            >
              <Input
                id="cto-search"
                name="q"
                key={q}
                defaultValue={q}
                placeholder="Identificação CTO ou contrato…"
                autoComplete="off"
                className="h-8 flex-1"
                disabled={pending}
              />
              <Button type="submit" size="sm" disabled={pending}>
                Buscar
              </Button>
            </form>
          </div>
        </div>
        {hasActiveFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={clearAllFilters}
              disabled={pending}
            >
              <FilterX className="size-4" aria-hidden />
              Limpar filtros
            </Button>
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
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
