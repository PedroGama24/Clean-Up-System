import { History } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HistoricoCtoItem } from "@/lib/cto/fetch-historico";
import { formatDateTimePtBr } from "@/lib/format";
import { cn } from "@/lib/utils";

function acaoLabel(acao: string): string {
  if (acao === "Criação") return "Criou";
  if (acao === "Atualização") return "Atualizou";
  return acao;
}

type CtoHistoricoAuditoriaProps = {
  items: HistoricoCtoItem[];
  errorMessage?: string | null;
  className?: string;
};

export function CtoHistoricoAuditoria({
  items,
  errorMessage,
  className,
}: CtoHistoricoAuditoriaProps) {
  return (
    <Card
      className={cn(
        "border-border/70 bg-card/50 shadow-md shadow-black/[0.03] ring-1 ring-border/40 dark:shadow-black/25",
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
            <History className="size-4 text-foreground" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base">Histórico de auditoria</CardTitle>
            <CardDescription>
              Criação e atualizações registradas com BKO, data e hora.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {errorMessage ? (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive text-sm"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum registro de histórico ainda. Novas ações passarão a ser
            listadas aqui.
          </p>
        ) : (
          <ol className="m-0 max-h-[min(24rem,60vh)] space-y-2.5 overflow-y-auto p-0">
            {items.map((h) => (
              <li
                key={h.id}
                className="rounded-lg border border-border/60 bg-muted/10 px-3.5 py-2.5"
              >
                <p className="font-medium text-foreground leading-snug">
                  {h.bko_nome}
                </p>
                <p className="text-muted-foreground text-sm">
                  {acaoLabel(h.acao)} · {formatDateTimePtBr(h.created_at)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
