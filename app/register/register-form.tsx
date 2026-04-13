"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const PENDING_MESSAGE =
  "Sua conta foi criada e está aguardando aprovação do Administrador de TI para ser liberada.";

export function RegisterForm() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    const nome = nomeCompleto.trim();
    if (nome.length < 3) {
      setError("Informe o nome completo (mínimo 3 caracteres).");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const { error: signError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        ...(origin ? { emailRedirectTo: `${origin}/login` } : {}),
        data: { nome_completo: nome },
      },
    });
    setPending(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    setRegistered(true);
  }

  if (registered) {
    return (
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Cadastro recebido</CardTitle>
          <CardDescription>Próximos passos</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-foreground text-sm leading-relaxed">
            {PENDING_MESSAGE}
          </p>
          <p className="mt-4 text-muted-foreground text-sm">
            Se o projeto exigir confirmação por e-mail, verifique sua caixa de
            entrada antes de tentar entrar.
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}
          >
            Ir para o login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="text-lg">Criar conta</CardTitle>
        <CardDescription>
          Registro para equipe de backoffice. O acesso só é liberado após
          aprovação do administrador.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4 pt-6">
          {error ? (
            <p
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive text-sm"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-nome">Nome completo</Label>
            <Input
              id="register-nome"
              name="nomeCompleto"
              type="text"
              autoComplete="name"
              required
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              placeholder="Nome e sobrenome"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-email">E-mail</Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.com.br"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-password">Senha</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-confirm">Confirmar senha</Label>
            <Input
              id="register-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Enviando…" : "Registrar"}
          </Button>
          <p className="text-center text-muted-foreground text-sm sm:text-left">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
