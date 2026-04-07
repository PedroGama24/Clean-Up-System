"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPending(false);
    if (signError) {
      setError(
        signError.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : signError.message,
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <Card className="w-full border-border/80 shadow-lg shadow-black/5 ring-1 ring-border/40 dark:shadow-black/20">
      <CardHeader className="space-y-1 border-border/60 border-b px-6 pb-5 pt-6">
        <CardTitle className="font-semibold text-xl tracking-tight">
          Acesso ao painel
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Informe o e-mail e a senha fornecidos pelo administrador.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-5 px-6 pt-6">
          {error ? (
            <p
              className="rounded-lg border border-destructive/35 bg-destructive/5 px-3 py-2.5 text-destructive text-sm leading-snug"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email" className="text-foreground">
              E-mail corporativo
            </Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.com.br"
              className="h-10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 px-6 pb-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            disabled={pending}
            className="h-10 w-full font-medium sm:w-auto sm:min-w-[7.5rem]"
          >
            {pending ? "Entrando…" : "Entrar"}
          </Button>
          <p className="text-center text-muted-foreground text-sm sm:text-right">
            Primeiro acesso?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
