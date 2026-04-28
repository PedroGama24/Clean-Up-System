/** Fuso usado na UI para timestamps vindos do Postgres em UTC (Supabase). */
export const BRAZIL_TIMEZONE = "America/Sao_Paulo";

const dateFmtBr = new Intl.DateTimeFormat("pt-BR", {
  timeZone: BRAZIL_TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFmtBr24 = new Intl.DateTimeFormat("pt-BR", {
  timeZone: BRAZIL_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * Data/hora no padrão brasileiro no fuso de Brasília, ex.: "28/04/2026 às 15:30".
 * Use para `timestamptz` armazenado em UTC (ex.: `ultimo_cleanup`, `historico_cto.created_at`).
 */
export function formatDateTimePtBr(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return `${dateFmtBr.format(d)} às ${timeFmtBr24.format(d)}`;
  } catch {
    return "—";
  }
}
