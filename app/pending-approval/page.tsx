import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          Sistema CleanUp
        </p>
        <h1 className="mt-1 font-semibold text-2xl tracking-tight">
          Acesso pendente
        </h1>
      </div>
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Aguardando liberação</CardTitle>
          <CardDescription>
            Sua conta está cadastrada, mas ainda não foi aprovada para uso do
            painel.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-foreground text-sm leading-relaxed">
            Entre em contato com o <strong>Administrador de TI</strong> para
            aprovar seu acesso. Até lá, os dados de CTO não ficam disponíveis.
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <SignOutButton />
        </CardFooter>
      </Card>
    </div>
  );
}
