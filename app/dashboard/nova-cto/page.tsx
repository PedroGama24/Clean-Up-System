import { NovaCtoForm } from "@/components/dashboard/nova-cto-form";

export default function NovaCtoPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-md shadow-black/[0.03] ring-1 ring-border/40 backdrop-blur-sm sm:p-8 dark:shadow-black/25">
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Registro
          </p>
          <h1 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
            Novo clean up
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-[0.9375rem]">
            Cadastre a CTO, defina a capacidade e preencha o status de cada
            porta. Ao salvar, você será levado à tela da caixa para gerar a
            mensagem ao técnico (WhatsApp).
          </p>
        </div>
      </section>

      <NovaCtoForm />
    </div>
  );
}
