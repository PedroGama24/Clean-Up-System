import { NextResponse } from "next/server";
import { z } from "zod";

import { getResolvedIdentificacaoCtoForDuplicateCheck } from "@/lib/cto/cadastro-cto-persist-header";
import { findCadastroCtoDuplicateByIdentificacao } from "@/lib/cto/check-duplicate-identificacao-cto";
import { CTO_TECNOLOGIAS } from "@/lib/validations/nova-cto";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  cidade: z.string().min(1),
  identificacao_cto: z.string(),
  tecnologia: z.union([z.enum(CTO_TECNOLOGIAS), z.literal("")]),
  possui_cordoaria: z.boolean().optional(),
  hw_ct: z.string(),
  hw_cb: z.string(),
  hw_cd: z.string(),
  hw_bk: z.string(),
  area_caixa: z.string(),
  valor_caixa: z.string(),
  excludeCtoId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sessão expirada ou não autenticado. Entre novamente." },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, {
      status: 400,
    });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos para verificação." },
      { status: 400 },
    );
  }

  const b = parsed.data;
  const identificacao_cto = getResolvedIdentificacaoCtoForDuplicateCheck({
    cidade: b.cidade,
    identificacao_cto: b.identificacao_cto,
    tecnologia: b.tecnologia,
    possui_cordoaria: b.possui_cordoaria,
    hw_ct: b.hw_ct,
    hw_cb: b.hw_cb,
    hw_cd: b.hw_cd,
    hw_bk: b.hw_bk,
    area_caixa: b.area_caixa,
    valor_caixa: b.valor_caixa,
  });

  const dup = await findCadastroCtoDuplicateByIdentificacao(
    supabase,
    b.cidade,
    identificacao_cto,
    b.excludeCtoId,
  );

  if (dup.duplicate) {
    return NextResponse.json({ duplicate: true, message: dup.message });
  }

  return NextResponse.json({ duplicate: false });
}
