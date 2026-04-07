import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">
          Sistema CleanUp
        </h1>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          Backoffice para cadastro e auditoria de portas em CTOs (caixas de
          terminação óptica). Autenticação e dados ficam no Supabase; configure
          as variáveis em{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            .env.local
          </code>{" "}
          a partir de{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">env.example</code>
          .
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className={cn(buttonVariants({ variant: "default" }))}
          href="/login"
        >
          Entrar
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href="/register"
        >
          Registrar
        </Link>
        <a
          className={cn(buttonVariants({ variant: "outline" }))}
          href="https://supabase.com/dashboard"
        >
          Abrir Supabase
        </a>
      </div>
    </div>
  );
}
