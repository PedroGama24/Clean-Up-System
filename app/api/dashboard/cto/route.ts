import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createCtoWithLotesForUser } from "@/lib/cto/create-cto-with-lotes";
import { createClient } from "@/lib/supabase/server";

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, {
      status: 400,
    });
  }

  const result = await createCtoWithLotesForUser(supabase, body);

  if ("success" in result && result.success) {
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/cto/${result.id}`);
    return NextResponse.json(result);
  }

  return NextResponse.json(result, { status: 400 });
}
