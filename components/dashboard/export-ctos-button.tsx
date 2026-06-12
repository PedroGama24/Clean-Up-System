"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { exportAllCtosAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import type { CtoExportRow } from "@/lib/cto/fetch-all-ctos-for-export";
import { formatDateTimePtBr } from "@/lib/format";

function toText(v: string | number | null | undefined): string {
  return v == null ? "" : String(v);
}

function boolToPtBr(v: boolean | null): string {
  if (v === true) return "Sim";
  if (v === false) return "Não";
  return "";
}

/** Escapa um valor segundo o RFC básico de CSV (separador `;`). */
function escapeCsv(value: string): string {
  if (/[";\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const CSV_COLUMNS: { header: string; value: (r: CtoExportRow) => string }[] = [
  { header: "Identificação da CTO", value: (r) => toText(r.identificacao_cto) },
  { header: "Cidade", value: (r) => toText(r.cidade) },
  { header: "Bairro", value: (r) => toText(r.bairro) },
  { header: "Rua", value: (r) => toText(r.rua) },
  { header: "Técnico", value: (r) => toText(r.tecnico_campo) },
  { header: "Contrato", value: (r) => toText(r.contrato) },
  { header: "OLT", value: (r) => toText(r.olt) },
  { header: "Slot", value: (r) => toText(r.slot) },
  { header: "PON", value: (r) => toText(r.pon) },
  {
    header: "Data do Último Clean Up",
    value: (r) => formatDateTimePtBr(r.ultimo_cleanup),
  },
  { header: "Tecnologia", value: (r) => toText(r.tecnologia) },
  { header: "Capacidade", value: (r) => toText(r.capacidade) },
  { header: "Vagas Atuais", value: (r) => toText(r.vagas_atuais) },
  { header: "BKO", value: (r) => toText(r.bko_nome) },
  { header: "Observações", value: (r) => toText(r.observacoes) },
  { header: "Sem Identificação", value: (r) => boolToPtBr(r.sem_identificacao) },
  { header: "Possui Cordoaria", value: (r) => boolToPtBr(r.possui_cordoaria) },
  { header: "HW CT", value: (r) => toText(r.hw_ct) },
  { header: "HW CB", value: (r) => toText(r.hw_cb) },
  { header: "HW CD", value: (r) => toText(r.hw_cd) },
  { header: "HW BK", value: (r) => toText(r.hw_bk) },
  { header: "Valor da Caixa", value: (r) => toText(r.valor_caixa) },
  { header: "Área da Caixa", value: (r) => toText(r.area_caixa) },
];

function buildCsv(rows: CtoExportRow[]): string {
  const headerLine = CSV_COLUMNS.map((c) => escapeCsv(c.header)).join(";");
  const dataLines = rows.map((r) =>
    CSV_COLUMNS.map((c) => escapeCsv(c.value(r))).join(";"),
  );
  // BOM (\uFEFF) garante acentuação correta ao abrir no Excel (PT-BR).
  return `\uFEFF${[headerLine, ...dataLines].join("\r\n")}`;
}

function downloadCsv(csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const suffix = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio_clean_ups_${suffix}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportCtosButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await exportAllCtosAction();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      if (result.rows.length === 0) {
        toast.info("Nenhuma CTO cadastrada para exportar.");
        return;
      }
      downloadCsv(buildCsv(result.rows));
      toast.success(`Exportadas ${result.rows.length} CTO(s).`);
    } catch {
      toast.error("Não foi possível gerar o arquivo. Tente de novo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleExport}
      disabled={isLoading}
      className="inline-flex h-11 w-full shrink-0 justify-center gap-2 font-medium shadow-sm sm:w-auto"
    >
      {isLoading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Download className="size-4 shrink-0" aria-hidden />
      )}
      {isLoading ? "Exportando…" : "Exportar"}
    </Button>
  );
}
