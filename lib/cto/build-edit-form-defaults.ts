import type { CtoCidade } from "@/lib/constants/cto-cidades";
import {
  CTO_CIDADES,
  isCidadeComTecnologiaSp,
} from "@/lib/constants/cto-cidades";
import type { CtoTecnologia } from "@/lib/validations/nova-cto";
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
  tecnologia: string | null;
  possui_cordoaria: boolean | null;
  hw_ct: string | null;
  hw_cb: string | null;
  hw_cd: string | null;
  hw_bk: string | null;
  valor_caixa: string | null;
  area_caixa: string | null;
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

function inferTecnologiaSp(cto: CtoHeader): CtoTecnologia | "" {
  if (!isCidadeComTecnologiaSp(cto.cidade)) {
    return "";
  }
  const fromCol = cto.tecnologia?.trim();
  if (fromCol === "HW" || fromCol === "FH" || fromCol === "NK") {
    return fromCol;
  }
  if (
    cto.hw_ct?.trim() ||
    cto.hw_cb?.trim() ||
    cto.hw_cd?.trim() ||
    cto.hw_bk?.trim()
  ) {
    return "HW";
  }
  if (cto.possui_cordoaria === true || cto.possui_cordoaria === false) {
    return "NK";
  }
  if (cto.identificacao_cto?.trim()) {
    return "FH";
  }
  return "";
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

  const cidade = safeCidade(cto.cidade);
  const tecnologia = inferTecnologiaSp(cto);

  return {
    id: cto.id,
    cidade,
    identificacao_cto: cto.identificacao_cto ?? "",
    tecnologia,
    possui_cordoaria:
      cto.possui_cordoaria === true || cto.possui_cordoaria === false
        ? cto.possui_cordoaria
        : undefined,
    hw_ct: cto.hw_ct?.trim() ? cto.hw_ct : "",
    hw_cb: cto.hw_cb?.trim() ? cto.hw_cb : "",
    hw_cd: cto.hw_cd?.trim() ? cto.hw_cd : "",
    hw_bk: cto.hw_bk?.trim() ? cto.hw_bk : "",
    area_caixa: cto.area_caixa?.trim() ? cto.area_caixa : "",
    valor_caixa: cto.valor_caixa?.trim() ? cto.valor_caixa : "",
    tecnico_campo: safeTecnico(cto.tecnico_campo),
    olt: cto.olt ?? "",
    slot: cto.slot != null ? String(cto.slot) : "",
    pon: cto.pon != null ? String(cto.pon) : "",
    observacoes: cto.observacoes?.trim() ? cto.observacoes : "",
    capacidade: cto.capacidade as 8 | 16,
    portas,
  };
}
