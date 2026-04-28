/** Mensagens alinhadas ao Zod em `nova-cto.ts`. */
export const MSG_APENAS_LETRAS_NUMEROS = "Apenas letras e números (sem espaços)";
export const MSG_APENAS_LETRAS_NUMEROS_HIFEN_OLT =
  "Apenas letras, números e hífen (sem espaços)";
export const MSG_APENAS_NUMEROS = "Apenas números";

export function sanitizeAlnumUpperInput(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** OLT: maiúsculas, dígitos e hífen `-`. */
export function sanitizeOltInput(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

export function sanitizeDigitsInput(raw: string): string {
  return raw.replace(/\D/g, "");
}
