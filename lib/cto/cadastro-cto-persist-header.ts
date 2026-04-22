import { isCidadeComTecnologiaSp } from "@/lib/constants/cto-cidades";
import type { NovaCtoFormValues } from "@/lib/validations/nova-cto";

import { resolveIdentificacaoCtoForPersist } from "./resolve-identificacao-cto";

function nullIfEmpty(s: string | undefined | null): string | null {
  const t = s?.trim() ?? "";
  return t === "" ? null : t;
}

/** Campos do passo 1 suficientes para montar a mesma `identificacao_cto` do persistência. */
export type Step1IdentificacaoForDuplicateCheck = Pick<
  NovaCtoFormValues,
  | "cidade"
  | "semIdentificacao"
  | "identificacao_cto"
  | "tecnologia"
  | "hw_ct"
  | "hw_cb"
  | "hw_cd"
  | "hw_bk"
  | "area_caixa"
  | "valor_caixa"
  | "possui_cordoaria"
>;

export function getResolvedIdentificacaoCtoForDuplicateCheck(
  data: Step1IdentificacaoForDuplicateCheck,
): string {
  if (data.semIdentificacao) {
    return "Sem Identificação";
  }
  return buildCadastroCtoPersistHeader(data as NovaCtoFormValues)
    .identificacao_cto;
}

/** Colunas extras do cabeçalho `cadastro_cto` + identificação resolvida para o INSERT/UPDATE. */
export function buildCadastroCtoPersistHeader(data: NovaCtoFormValues) {
  if (data.semIdentificacao) {
    return {
      identificacao_cto: "Sem Identificação",
      tecnologia: null,
      possui_cordoaria: null,
      hw_ct: null,
      hw_cb: null,
      hw_cd: null,
      hw_bk: null,
      area_caixa: null,
      valor_caixa: null,
    };
  }

  const sp = isCidadeComTecnologiaSp(data.cidade);
  const tecnologia = (data.tecnologia ?? "").trim();

  const identificacao_cto = resolveIdentificacaoCtoForPersist({
    cidade: data.cidade,
    identificacao_cto: data.identificacao_cto,
    tecnologia: data.tecnologia,
    hw_ct: data.hw_ct,
    hw_cb: data.hw_cb,
    hw_cd: data.hw_cd,
    hw_bk: data.hw_bk,
    area_caixa: data.area_caixa,
    valor_caixa: data.valor_caixa,
  });

  return {
    identificacao_cto,
    tecnologia: sp && tecnologia !== "" ? tecnologia : null,
    possui_cordoaria:
      sp && (tecnologia === "HW" || tecnologia === "FH" || tecnologia === "NK")
        ? (data.possui_cordoaria as boolean)
        : null,
    hw_ct: sp && tecnologia === "HW" ? nullIfEmpty(data.hw_ct) : null,
    hw_cb: sp && tecnologia === "HW" ? nullIfEmpty(data.hw_cb) : null,
    hw_cd: sp && tecnologia === "HW" ? nullIfEmpty(data.hw_cd) : null,
    hw_bk: sp && tecnologia === "HW" ? nullIfEmpty(data.hw_bk) : null,
    area_caixa: !sp ? nullIfEmpty(data.area_caixa) : null,
    valor_caixa: !sp ? nullIfEmpty(data.valor_caixa) : null,
  };
}
