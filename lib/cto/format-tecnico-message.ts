import { PORT_STATUS } from "@/lib/constants/cto";
import type { EditCtoFormValues } from "@/lib/validations/edit-cto";

/** Texto da coluna Área / Primária para mensagens ao técnico. */
export function areaLineFromEditForm(
  v: Pick<
    EditCtoFormValues,
    "areaOrigem" | "areaCodigo" | "primariaCodigo"
  >,
): string {
  if (v.areaOrigem === "codigo_interno") {
    const c = v.areaCodigo?.trim();
    return c && c.length > 0 ? c : "—";
  }
  const p = v.primariaCodigo?.trim();
  return p ? `Primária: ${p}` : "—";
}

/** Lista em português: "3, 5, 8 e 12". */
export function formatPortasLivresList(nums: number[]): string {
  const sorted = [...nums].sort((a, b) => a - b);
  if (sorted.length === 0) {
    return "Nenhuma porta livre no momento";
  }
  if (sorted.length === 1) {
    return `${sorted[0]}`;
  }
  if (sorted.length === 2) {
    return `${sorted[0]} e ${sorted[1]}`;
  }
  const allButLast = sorted.slice(0, -1).join(", ");
  return `${allButLast} e ${sorted[sorted.length - 1]}`;
}

/**
 * Template exato solicitado para envio à operação de campo (WhatsApp etc.).
 */
export function buildTecnicoCleanUpMessage(
  values: EditCtoFormValues,
): string {
  const nome = values.nome_cto.trim() || "—";
  const area = areaLineFromEditForm(values);
  const livres = values.portas.filter((p) => p.status === PORT_STATUS.LIVRE);
  const vagasLivres = livres.length;
  const nums = livres.map((p) => p.numero_porta);
  const portasText = formatPortasLivresList(nums);

  return `✅ *Clean Up Concluído - Virtus Telecom*
*CTO:* ${nome} | *Área:* ${area}
*Vagas Livres:* ${vagasLivres}
*Portas Disponíveis:* ${portasText}`;
}
