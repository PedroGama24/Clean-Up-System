"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { TecnicoCampoCombobox } from "@/components/dashboard/tecnico-campo-combobox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CTO_CIDADES } from "@/lib/constants/cto-cidades";
import { PORT_STATUS } from "@/lib/constants/cto";
import { cn } from "@/lib/utils";
import {
  novaCtoFormSchema,
  PORT_STATUSES,
  type NovaCtoFormValues,
} from "@/lib/validations/nova-cto";

const step1Fields = [
  "cidade",
  "identificacao_cto",
  "tecnico_campo",
  "olt",
  "slot",
  "pon",
] as const satisfies readonly (keyof NovaCtoFormValues)[];

export function NovaCtoForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<NovaCtoFormValues>({
    resolver: zodResolver(novaCtoFormSchema),
    defaultValues: {
      cidade: "BMA",
      identificacao_cto: "",
      tecnico_campo: "",
      olt: "",
      slot: "",
      pon: "",
      observacoes: "",
      capacidade: 8,
      portas: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const { fields, replace } = useFieldArray({
    control,
    name: "portas",
  });

  const capacidade = watch("capacidade");

  const stepLabels = useMemo(
    () => ["Dados da CTO", "Capacidade", "Portas", "Observações"],
    [],
  );

  function syncPortRows(cap: 8 | 16) {
    replace(
      Array.from({ length: cap }, (_, i) => ({
        numero_porta: i + 1,
        status: PORT_STATUS.LIVRE,
        contrato: "",
      })),
    );
  }

  async function goToStep2() {
    const ok = await trigger([...step1Fields]);
    if (!ok) return;
    setStep(2);
  }

  async function goToStep3() {
    const ok = await trigger(["capacidade"]);
    if (!ok) return;
    const cap = getValues("capacidade");
    syncPortRows(cap);
    setStep(3);
  }

  async function goToStep4() {
    const ok = await trigger(["portas"]);
    if (!ok) return;
    setStep(4);
  }

  async function onSubmit(values: NovaCtoFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/cto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await res.json()) as
        | { success: true; id: string }
        | { error: string };
      if (!res.ok || "error" in result) {
        toast.error("error" in result ? result.error : "Falha ao salvar.");
        return;
      }
      toast.success(
        "Clean up registrado. Abra a mensagem para o técnico e envie pelo WhatsApp.",
      );
      router.push(`/dashboard/cto/${result.id}?mensagem=1`);
      router.refresh();
    } catch {
      toast.error("Não foi possível enviar o formulário. Tente de novo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Voltar ao painel
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
        {stepLabels.map((label, i) => (
          <span
            key={label}
            className={cn(
              "rounded-full border px-2.5 py-0.5",
              step === i + 1
                ? "border-foreground/20 bg-muted text-foreground"
                : "border-transparent",
            )}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">Passo 1 — Cabeçalho</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={!!errors.cidade}>
                    <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
                    <Controller
                      name="cidade"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="cidade"
                            className="h-8 w-full max-w-lg"
                            size="default"
                          >
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {CTO_CIDADES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.cidade]} />
                  </Field>

                  <Field data-invalid={!!errors.identificacao_cto}>
                    <FieldLabel htmlFor="identificacao_cto">
                      Identificação CTO
                    </FieldLabel>
                    <Input
                      id="identificacao_cto"
                      className="max-w-lg"
                      autoComplete="off"
                      {...register("identificacao_cto")}
                    />
                    <FieldError errors={[errors.identificacao_cto]} />
                  </Field>

                  <Field data-invalid={!!errors.tecnico_campo}>
                    <FieldLabel htmlFor="tecnico_campo">
                      Técnico de campo
                    </FieldLabel>
                    <Controller
                      name="tecnico_campo"
                      control={control}
                      render={({ field }) => (
                        <TecnicoCampoCombobox
                          id="tecnico_campo"
                          value={field.value}
                          onChange={field.onChange}
                          invalid={!!errors.tecnico_campo}
                        />
                      )}
                    />
                    <FieldError errors={[errors.tecnico_campo]} />
                  </Field>

                  <Field data-invalid={!!errors.olt}>
                    <FieldLabel htmlFor="olt">OLT</FieldLabel>
                    <Input id="olt" {...register("olt")} />
                    <FieldError errors={[errors.olt]} />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field data-invalid={!!errors.slot}>
                      <FieldLabel htmlFor="slot">Slot</FieldLabel>
                      <Input id="slot" inputMode="numeric" {...register("slot")} />
                      <FieldError errors={[errors.slot]} />
                    </Field>
                    <Field data-invalid={!!errors.pon}>
                      <FieldLabel htmlFor="pon">PON</FieldLabel>
                      <Input id="pon" inputMode="numeric" {...register("pon")} />
                      <FieldError errors={[errors.pon]} />
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>

              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={goToStep2}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">
                Passo 2 — Capacidade da caixa
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FieldSet>
                <FieldLegend className="text-sm">
                  Quantas portas tem esta CTO?
                </FieldLegend>
                <Field
                  data-invalid={!!errors.capacidade}
                  className="max-w-md"
                >
                  <Controller
                    name="capacidade"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        className="flex flex-wrap gap-4"
                        value={String(field.value)}
                        onValueChange={(v) =>
                          field.onChange(Number(v) as 8 | 16)
                        }
                      >
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <RadioGroupItem value="8" id="cap-8" />
                          <span>8 portas</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <RadioGroupItem value="16" id="cap-16" />
                          <span>16 portas</span>
                        </label>
                      </RadioGroup>
                    )}
                  />
                  <FieldError errors={[errors.capacidade]} />
                </Field>
              </FieldSet>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button type="button" onClick={goToStep3}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">
                Passo 3 — Lotes ({capacidade} portas)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {errors.portas?.message && (
                <p className="text-destructive text-sm" role="alert">
                  {errors.portas.message as string}
                </p>
              )}
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Porta</TableHead>
                      <TableHead className="min-w-[220px]">Status</TableHead>
                      <TableHead className="min-w-[200px]">Contrato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const st = watch(`portas.${index}.status`);
                      const showContract =
                        st === PORT_STATUS.COM_CONTRATO;
                      return (
                        <TableRow key={field.id}>
                          <TableCell className="align-middle font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="align-middle">
                            <select
                              className={cn(
                                "h-8 w-full min-w-[200px] rounded-lg border border-input bg-transparent px-2 text-sm outline-none",
                                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
                              )}
                              {...register(`portas.${index}.status`)}
                            >
                              {PORT_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            {errors.portas?.[index]?.status && (
                              <p className="mt-1 text-destructive text-xs">
                                {errors.portas[index]?.status?.message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="align-middle">
                            {showContract ? (
                              <>
                                <Input
                                  placeholder="Nº do contrato"
                                  className="min-w-[180px]"
                                  {...register(`portas.${index}.contrato`)}
                                />
                                {errors.portas?.[index]?.contrato && (
                                  <p className="mt-1 text-destructive text-xs">
                                    {errors.portas[index]?.contrato?.message}
                                  </p>
                                )}
                              </>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-wrap justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Voltar
                </Button>
                <Button type="button" onClick={goToStep4}>
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">Passo 4 — Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Field data-invalid={!!errors.observacoes}>
                <FieldLabel htmlFor="observacoes">Observações (opcional)</FieldLabel>
                <Textarea
                  id="observacoes"
                  rows={5}
                  className="max-w-2xl"
                  placeholder="Detalhes adicionais para a equipe…"
                  {...register("observacoes")}
                />
                <FieldError errors={[errors.observacoes]} />
              </Field>

              <div className="flex flex-wrap justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                >
                  Voltar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando…" : "Salvar clean up"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
