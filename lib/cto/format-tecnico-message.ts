import { portStatusIsVagaLivre } from "@/lib/constants/cto";
import type { EditCtoFormValues } from "@/lib/validations/edit-cto";

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
  const idCto = values.identificacao_cto.trim() || "—";
  const cidade = values.cidade;
  const tecnico = values.tecnico_campo.trim() || "—";
  const livres = values.portas.filter((p) => portStatusIsVagaLivre(p.status));
  const vagasLivres = livres.length;
  const nums = livres.map((p) => p.numero_porta);
  const portasText = formatPortasLivresList(nums);

  const livresOrdenadas = [...livres].sort(
    (a, b) => a.numero_porta - b.numero_porta,
  );
  const detalhePortas =
    livresOrdenadas.length === 0
      ? ""
      : livresOrdenadas
          .map((p) => {
            const c = p.contrato?.trim();
            if (c) {
              return `Porta ${p.numero_porta}: contrato liberado ${c}`;
            }
            return `Porta ${p.numero_porta}: sem contrato informado`;
          })
          .join("\n");

  const blocoDetalhe =
    detalhePortas === ""
      ? ""
      : `\n*Detalhe (portas livres / contrato):*\n${detalhePortas}`;

  return `✅ *Clean Up Concluído - Virtus Telecom*
*CTO:* ${idCto} | *Cidade:* ${cidade} | *Técnico:* ${tecnico}
*Vagas Livres:* ${vagasLivres}
*Portas Disponíveis:* ${portasText}${blocoDetalhe}`;
}
