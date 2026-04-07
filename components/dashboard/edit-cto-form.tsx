"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateCtoAction } from "@/app/dashboard/cto/[id]/actions";
import { CtoTecnicoMessageDialog } from "@/components/dashboard/cto-tecnico-message-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PORT_STATUS } from "@/lib/constants/cto";
import { cn } from "@/lib/utils";
import {
  editCtoFormSchema,
  type EditCtoFormValues,
} from "@/lib/validations/edit-cto";
import { PORT_STATUSES } from "@/lib/validations/nova-cto";

const step1Fields = [
  "nome_cto",
  "areaOrigem",
  "areaCodigo",
  "primariaCodigo",
  "olt",
  "slot",
  "pon",
  "potencia_dbm",
] as const satisfies readonly (keyof EditCtoFormValues)[];

type EditCtoFormProps = {
  defaultValues: EditCtoFormValues;
};

export function EditCtoForm({ defaultValues }: EditCtoFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [tecnicoDialogOpen, setTecnicoDialogOpen] = useState(false);

  const form = useForm<EditCtoFormValues>({
    resolver: zodResolver(editCtoFormSchema),
    defaultValues,
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

  const { fields } = useFieldArray({
    control,
    name: "portas",
  });

  const capacidade = watch("capacidade");
  const areaOrigem = watch("areaOrigem");

  const stepLabels = useMemo(
    () => ["Dados da CTO", "Capacidade", "Portas"],
    [],
  );

  async function goToStep2() {
    const ok = await trigger([...step1Fields]);
    if (!ok) return;
    setStep(2);
  }

  async function goToStep3() {
    setStep(3);
  }

  async function onSubmit(values: EditCtoFormValues) {
    setSubmitting(true);
    try {
      const result = await updateCtoAction(values);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Auditoria atualizada e Clean Up registrado.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Não foi possível salvar. Tente de novo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <input type="hidden" {...register("id")} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Voltar ao painel
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={() => setTecnicoDialogOpen(true)}
        >
          Gerar Mensagem para Técnico
        </Button>
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
                  <Field data-invalid={!!errors.nome_cto}>
                    <FieldLabel htmlFor="edit_nome_cto">Nome da CTO</FieldLabel>
                    <Input
                      id="edit_nome_cto"
                      autoComplete="off"
                      {...register("nome_cto")}
                    />
                    <FieldError errors={[errors.nome_cto]} />
                  </Field>

                  <Field data-invalid={!!errors.areaOrigem}>
                    <FieldLabel htmlFor="edit_areaOrigem">Área</FieldLabel>
                    <select
                      id="edit_areaOrigem"
                      className={cn(
                        "h-8 w-full max-w-lg rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
                        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                      )}
                      {...register("areaOrigem")}
                    >
                      <option value="codigo_interno">
                        Área identificada (código do sistema BKO)
                      </option>
                      <option value="sem_area">
                        Não há área — preencher Primária
                      </option>
                    </select>
                    <FieldDescription>
                      Escolha se conhece o <strong>código da área</strong> (digita
                      abaixo) ou se não há área e informa só o{" "}
                      <strong>código de referência Primária</strong>.
                    </FieldDescription>
                    <FieldError errors={[errors.areaOrigem]} />
                  </Field>

                  {areaOrigem === "codigo_interno" && (
                    <Field data-invalid={!!errors.areaCodigo}>
                      <FieldLabel htmlFor="edit_areaCodigo">
                        Código da área
                      </FieldLabel>
                      <Input
                        id="edit_areaCodigo"
                        className="max-w-md"
                        placeholder="Ex.: 04, 12, 3…"
                        autoComplete="off"
                        {...register("areaCodigo")}
                      />
                      <FieldError errors={[errors.areaCodigo]} />
                    </Field>
                  )}

                  {areaOrigem === "sem_area" && (
                    <div className="rounded-xl border border-dashed bg-muted/20 p-4">
                      <p className="mb-3 font-medium text-sm">Primária</p>
                      <FieldGroup>
                        <Field data-invalid={!!errors.primariaCodigo}>
                          <FieldLabel htmlFor="edit_primariaCodigo">
                            Código de referência (Primária)
                          </FieldLabel>
                          <Input
                            id="edit_primariaCodigo"
                            placeholder="Referência que o BKO usa no sistema"
                            autoComplete="off"
                            className="max-w-md"
                            {...register("primariaCodigo")}
                          />
                          <FieldError errors={[errors.primariaCodigo]} />
                        </Field>
                      </FieldGroup>
                    </div>
                  )}

                  <Field data-invalid={!!errors.olt}>
                    <FieldLabel htmlFor="edit_olt">OLT</FieldLabel>
                    <Input id="edit_olt" {...register("olt")} />
                    <FieldError errors={[errors.olt]} />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field data-invalid={!!errors.slot}>
                      <FieldLabel htmlFor="edit_slot">Slot</FieldLabel>
                      <Input
                        id="edit_slot"
                        inputMode="numeric"
                        {...register("slot")}
                      />
                      <FieldError errors={[errors.slot]} />
                    </Field>
                    <Field data-invalid={!!errors.pon}>
                      <FieldLabel htmlFor="edit_pon">PON</FieldLabel>
                      <Input
                        id="edit_pon"
                        inputMode="numeric"
                        {...register("pon")}
                      />
                      <FieldError errors={[errors.pon]} />
                    </Field>
                  </div>

                  <Field data-invalid={!!errors.potencia_dbm}>
                    <FieldLabel htmlFor="edit_potencia_dbm">
                      Potência (dBm)
                    </FieldLabel>
                    <Input
                      id="edit_potencia_dbm"
                      inputMode="decimal"
                      {...register("potencia_dbm")}
                    />
                    <FieldError errors={[errors.potencia_dbm]} />
                  </Field>
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
                  Capacidade registrada (somente leitura na edição)
                </FieldLegend>
                <Field className="max-w-md">
                  <Controller
                    name="capacidade"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        className="flex flex-wrap gap-4 opacity-70"
                        value={String(field.value)}
                        disabled
                      >
                        <label className="flex cursor-not-allowed items-center gap-2 text-sm">
                          <RadioGroupItem value="8" id="edit-cap-8" disabled />
                          <span>8 portas</span>
                        </label>
                        <label className="flex cursor-not-allowed items-center gap-2 text-sm">
                          <RadioGroupItem value="16" id="edit-cap-16" disabled />
                          <span>16 portas</span>
                        </label>
                      </RadioGroup>
                    )}
                  />
                  <FieldDescription>
                    Para alterar a capacidade, é necessário um fluxo dedicado;
                    aqui você mantém as {getValues("capacidade")} portas já
                    cadastradas.
                  </FieldDescription>
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
              <CardDescription>
                Altere apenas o status das portas que sofreram mudança e clique
                em Salvar para registrar o Clean Up de hoje.
              </CardDescription>
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
                      const showContract = st === PORT_STATUS.COM_CONTRATO;
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
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando…" : "Salvar alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>

      <div className="flex flex-wrap justify-end gap-2 border-border/60 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setTecnicoDialogOpen(true)}
        >
          Gerar Mensagem para Técnico
        </Button>
      </div>

      <CtoTecnicoMessageDialog
        getValues={getValues}
        open={tecnicoDialogOpen}
        onOpenChange={setTecnicoDialogOpen}
      />
    </div>
  );
}
