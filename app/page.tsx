import { LayoutDashboard, Network, Radio, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: LayoutDashboard,
    title: "Painel unificado",
    description:
      "Visão das CTOs, vagas livres, alertas críticos e histórico de clean up em um só lugar.",
  },
  {
    icon: Radio,
    title: "Porta a porta",
    description:
      "Auditoria detalhada por porta, contratos e status alinhados à operação de campo.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso corporativo",
    description:
      "Login seguro com perfis aprovados. Ambiente exclusivo para equipes Virtus Telecom.",
  },
] as const;

export default function Home() {
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

      <header className="relative border-border/60 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm ring-1 ring-foreground/10">
              <Network className="size-[1.1rem]" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-foreground text-sm tracking-tight sm:text-base">
                Sistema CleanUp
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Virtus Telecom
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex",
              )}
            >
              Criar conta
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
          <p className="font-medium text-muted-foreground text-sm tracking-wide">
            Backoffice de rede · CTOs
          </p>
          <h1 className="mt-3 font-semibold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Gestão profissional de caixas de terminação óptica
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground text-base leading-relaxed sm:text-lg">
            Cadastre, audite e acompanhe portas livres e ocupadas. Menos planilhas,
            mais controle para o time de campo e o backoffice.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 min-w-[10rem] px-8 font-medium shadow-md shadow-black/10",
              )}
            >
              Acessar o painel
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 min-w-[10rem] px-8 font-medium",
              )}
            >
              Solicitar acesso
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-border/80 bg-card/60 shadow-sm ring-1 ring-border/40 backdrop-blur-sm transition-colors hover:bg-card/90"
            >
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </div>
                <CardTitle className="font-semibold text-base leading-snug">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      <footer className="relative border-border/60 border-t bg-muted/20 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-muted-foreground text-xs sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            © {new Date().getFullYear()} Virtus Telecom · Sistema CleanUp · Uso
            interno
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Supabase (administração)
          </a>
        </div>
      </footer>
    </div>
  );
}
