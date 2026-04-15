import { isCidadeComTecnologiaSp } from "@/lib/constants/cto-cidades";
import type { NovaCtoFormValues } from "@/lib/validations/nova-cto";

/** Campos do passo 1 a validar antes de avançar (depende de cidade e tecnologia). */
export function getNovaCtoStep1TriggerFieldNames(
  values: Pick<
    NovaCtoFormValues,
    | "cidade"
    | "tecnologia"
    | "identificacao_cto"
    | "tecnico_campo"
    | "olt"
    | "slot"
    | "pon"
    | "hw_ct"
    | "hw_cb"
    | "hw_cd"
    | "hw_bk"
    | "possui_cordoaria"
    | "area_caixa"
    | "valor_caixa"
  >,
): (keyof NovaCtoFormValues)[] {
  const base: (keyof NovaCtoFormValues)[] = [
    "cidade",
    "tecnico_campo",
    "olt",
    "slot",
    "pon",
  ];

  if (isCidadeComTecnologiaSp(values.cidade)) {
    base.push("tecnologia");
    const t = values.tecnologia ?? "";
    if (t === "HW") {
      base.push("hw_ct", "hw_cb", "hw_cd", "hw_bk", "possui_cordoaria");
    } else if (t === "NK") {
      base.push("identificacao_cto", "possui_cordoaria");
    } else if (t === "FH") {
      base.push("identificacao_cto", "possui_cordoaria");
    }
  } else {
    base.push("area_caixa", "valor_caixa");
  }

  return base;
}
