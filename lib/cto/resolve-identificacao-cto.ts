import { isCidadeComTecnologiaSp } from "@/lib/constants/cto-cidades";

type ResolveIdentificacaoInput = {
  cidade: string;
  identificacao_cto?: string | null;
  tecnologia?: string | null;
  hw_ct?: string | null;
  hw_cb?: string | null;
  hw_cd?: string | null;
  hw_bk?: string | null;
  area_caixa?: string | null;
  valor_caixa?: string | null;
};

/**
 * Monta `identificacao_cto` para persistência quando o campo único não foi usado
 * (HW ou cidades fora do grupo SP com área/caixa).
 */
export function resolveIdentificacaoCtoForPersist(
  input: ResolveIdentificacaoInput,
): string {
  const trimmed = input.identificacao_cto?.trim() ?? "";
  if (trimmed !== "") {
    return trimmed;
  }

  if (isCidadeComTecnologiaSp(input.cidade) && input.tecnologia === "HW") {
    const ct = input.hw_ct?.trim() ?? "";
    const cb = input.hw_cb?.trim() ?? "";
    const cd = input.hw_cd?.trim() ?? "";
    const bk = input.hw_bk?.trim() ?? "";
    return `CT: ${ct} | CB: ${cb} | CD: ${cd} | BK: ${bk}`;
  }

  if (!isCidadeComTecnologiaSp(input.cidade)) {
    const area = input.area_caixa?.trim() ?? "";
    const valor = input.valor_caixa?.trim() ?? "";
    return `Área ${area} - Caixa ${valor}`;
  }

  return trimmed;
}
