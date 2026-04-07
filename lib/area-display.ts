import { AREA_PRIMARIA_CODIGO } from "@/lib/constants/cto";

/** Rótulo amigável para código gravado na coluna `area`. */
export function formatAreaForDisplay(area: string | null | undefined): string {
  if (area == null || area === "") return "—";
  const t = area.trim();
  if (t === AREA_PRIMARIA_CODIGO || /^prim[aá]ria$/i.test(t)) {
    return `${AREA_PRIMARIA_CODIGO} (Primária)`;
  }
  return t;
}

export type AreaRowSlice = {
  area: string | null;
  primaria_codigo?: string | null;
};

/** Coluna única no painel: área conhecida OU referência Primária. */
export function formatAreaColumn(row: AreaRowSlice): string {
  const a = row.area?.trim();
  if (a) {
    return formatAreaForDisplay(a);
  }
  const p = row.primaria_codigo?.trim();
  if (p) {
    return `Primária: ${p}`;
  }
  return "—";
}
