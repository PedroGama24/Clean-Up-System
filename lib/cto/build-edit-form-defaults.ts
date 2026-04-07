import type { EditCtoFormValues } from "@/lib/validations/edit-cto";
import type { NovaCtoFormValues } from "@/lib/validations/nova-cto";

type CtoHeader = {
  id: string;
  nome_cto: string;
  area: string | null;
  primaria_codigo: string | null;
  olt: string | null;
  slot: number | null;
  pon: number | null;
  capacidade: number;
  potencia_dbm: string | number | null;
};

type LoteRow = {
  numero_porta: number;
  status: string;
  contrato: string | null;
};

/** Monta valores iniciais do formulário de edição a partir do Supabase. */
export function buildEditFormDefaults(
  cto: CtoHeader,
  lotes: LoteRow[],
): EditCtoFormValues {
  const hasArea = (cto.area?.trim()?.length ?? 0) > 0;
  const areaOrigem = hasArea ? "codigo_interno" : "sem_area";
  const potencia =
    cto.potencia_dbm == null || cto.potencia_dbm === ""
      ? ""
      : String(cto.potencia_dbm);

  const portas = [...lotes]
    .sort((a, b) => a.numero_porta - b.numero_porta)
    .map((l) => ({
      numero_porta: l.numero_porta,
      status: l.status as NovaCtoFormValues["portas"][number]["status"],
      contrato: l.contrato?.trim() ? l.contrato.trim() : "",
    }));

  return {
    id: cto.id,
    nome_cto: cto.nome_cto,
    areaOrigem,
    areaCodigo: hasArea ? (cto.area ?? "").trim() : "",
    primariaCodigo:
      !hasArea && cto.primaria_codigo ? cto.primaria_codigo.trim() : "",
    olt: cto.olt ?? "",
    slot: cto.slot != null ? String(cto.slot) : "",
    pon: cto.pon != null ? String(cto.pon) : "",
    potencia_dbm: potencia,
    capacidade: cto.capacidade as 8 | 16,
    portas,
  };
}
