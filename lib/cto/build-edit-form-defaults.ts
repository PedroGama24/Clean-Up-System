import type { CtoCidade } from "@/lib/constants/cto-cidades";
import { CTO_CIDADES } from "@/lib/constants/cto-cidades";
import { isTecnicoCampo, TECNICOS_CAMPO } from "@/lib/constants/tecnico-campo";
import type { EditCtoFormValues } from "@/lib/validations/edit-cto";
import type { NovaCtoFormValues } from "@/lib/validations/nova-cto";

type CtoHeader = {
  id: string;
  cidade: string;
  identificacao_cto: string;
  tecnico_campo: string;
  bko_nome: string | null;
  observacoes: string | null;
  olt: string | null;
  slot: number | null;
  pon: number | null;
  capacidade: number;
};

type LoteRow = {
  numero_porta: number;
  status: string;
  contrato: string | null;
};

function safeCidade(raw: string | null | undefined): CtoCidade {
  const t = raw?.trim() ?? "";
  return (CTO_CIDADES as readonly string[]).includes(t)
    ? (t as CtoCidade)
    : "BMA";
}

function safeTecnico(raw: string | null | undefined): string {
  const t = raw?.trim() ?? "";
  return isTecnicoCampo(t) ? t : TECNICOS_CAMPO[0];
}

/** Monta valores iniciais do formulário de edição a partir do Supabase. */
export function buildEditFormDefaults(
  cto: CtoHeader,
  lotes: LoteRow[],
): EditCtoFormValues {
  const portas = [...lotes]
    .sort((a, b) => a.numero_porta - b.numero_porta)
    .map((l) => ({
      numero_porta: l.numero_porta,
      status: l.status as NovaCtoFormValues["portas"][number]["status"],
      contrato: l.contrato?.trim() ? l.contrato.trim() : "",
    }));

  return {
    id: cto.id,
    cidade: safeCidade(cto.cidade),
    identificacao_cto: cto.identificacao_cto ?? "",
    tecnico_campo: safeTecnico(cto.tecnico_campo),
    olt: cto.olt ?? "",
    slot: cto.slot != null ? String(cto.slot) : "",
    pon: cto.pon != null ? String(cto.pon) : "",
    observacoes: cto.observacoes?.trim() ? cto.observacoes : "",
    capacidade: cto.capacidade as 8 | 16,
    portas,
  };
}
