import type { Step1IdentificacaoForDuplicateCheck } from "@/lib/cto/cadastro-cto-persist-header";

export type CheckDuplicateStep1Input = Step1IdentificacaoForDuplicateCheck & {
  excludeCtoId?: string;
};

export async function checkCtoDuplicateAtStep1(
  input: CheckDuplicateStep1Input,
): Promise<
  | { ok: true }
  | { ok: false; message: string }
  | { ok: false; error: string }
> {
  const res = await fetch("/api/dashboard/cto/check-duplicate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cidade: input.cidade,
      semIdentificacao: input.semIdentificacao ?? false,
      identificacao_cto: input.identificacao_cto,
      tecnologia: input.tecnologia ?? "",
      possui_cordoaria: input.possui_cordoaria,
      hw_ct: input.hw_ct ?? "",
      hw_cb: input.hw_cb ?? "",
      hw_cd: input.hw_cd ?? "",
      hw_bk: input.hw_bk ?? "",
      area_caixa: input.area_caixa ?? "",
      valor_caixa: input.valor_caixa ?? "",
      excludeCtoId: input.excludeCtoId,
    }),
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: "Resposta inválida do servidor." };
  }

  const obj = json as Record<string, unknown>;

  if (!res.ok) {
    return {
      ok: false,
      error: typeof obj.error === "string" ? obj.error : "Falha na verificação.",
    };
  }

  if (obj.duplicate === true && typeof obj.message === "string") {
    return { ok: false, message: obj.message };
  }

  return { ok: true };
}
