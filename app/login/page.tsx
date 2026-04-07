import { Network } from "lucide-react";
import { Suspense } from "react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.92_0.04_250/0.35),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.28_0.06_250/0.25),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.03)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[linear-gradient(to_bottom,black,transparent)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)]"
        aria-hidden
      />

      <div className="relative grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,24rem)]">
        <aside className="relative hidden flex-col justify-between border-border/60 border-b bg-muted/20 px-10 py-12 lg:flex lg:border-r lg:border-b-0 xl:px-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-foreground/10">
                <Network className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg tracking-tight">
                  Sistema CleanUp
                </p>
                <p className="text-muted-foreground text-sm">
                  Virtus Telecom
                </p>
              </div>
            </div>
            <h2 className="mt-14 max-w-md font-semibold text-3xl text-foreground tracking-tight leading-tight xl:text-4xl">
              Gestão de CTOs e ocupação de portas
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground text-base leading-relaxed">
              Cadastro, auditoria e acompanhamento das caixas de terminação
              óptica em um único painel corporativo.
            </p>
            <ul className="mt-10 max-w-sm space-y-3 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                Rastreio de portas livres e críticas em tempo real
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                Histórico de clean up e mensagens para campo
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                Acesso restrito ao backoffice aprovado
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Uso interno. Não compartilhe suas credenciais.
          </p>
        </aside>

        <main className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto w-full max-w-[22rem] sm:max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-foreground/10">
                  <Network className="size-[1.15rem]" strokeWidth={1.75} aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base tracking-tight">
                    Sistema CleanUp
                  </p>
                  <p className="text-muted-foreground text-xs">Virtus Telecom</p>
                </div>
              </div>
            </div>

            <Suspense
              fallback={
                <div className="h-72 w-full animate-pulse rounded-2xl bg-muted/60 ring-1 ring-border/50" />
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
