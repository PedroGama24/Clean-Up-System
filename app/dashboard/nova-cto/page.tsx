import { NovaCtoForm } from "@/components/dashboard/nova-cto-form";

export default function NovaCtoPage() {
  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-2xl tracking-tight">Novo clean up</h1>
      <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
        Cadastre a CTO, defina a capacidade e preencha o status de cada porta.
        Os dados são gravados no Supabase e as vagas são recalculadas
        automaticamente.
      </p>
      <div className="mt-6">
        <NovaCtoForm />
      </div>
    </div>
  );
}
