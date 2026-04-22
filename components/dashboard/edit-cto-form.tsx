"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateCtoAction } from "@/app/dashboard/cto/[id]/actions";
import { CtoTecnicoMessageDialog } from "@/components/dashboard/cto-tecnico-message-dialog";
import { TecnicoCampoCombobox } from "@/components/dashboard/tecnico-campo-combobox";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CtoStep1IdentificacaoFields } from "@/components/dashboard/cto-step1-identificacao-fields";
import { CTO_CIDADES } from "@/lib/constants/cto-cidades";
import { isCidadeComTecnologiaSp } from "@/lib/constants/cto-cidades";
import { PORT_STATUS, portStatusRequiresContract } from "@/lib/constants/cto";
import { checkCtoDuplicateAtStep1 } from "@/lib/cto/check-duplicate-cto-client";
import { getNovaCtoStep1TriggerFieldNames } from "@/lib/cto/nova-cto-step1-trigger-fields";
import { cn } from "@/lib/utils";
import {
  editCtoFormSchema,
  type EditCtoFormValues,
} from "@/lib/validations/edit-cto";
import type { NovaCtoFormValues } from "@/lib/validations/nova-cto";
import { PORT_STATUSES } from "@/lib/validations/nova-cto";

type EditCtoFormProps = {
  defaultValues: EditCtoFormValues;
  /** Abre o modal de mensagem para técnico (ex.: após cadastrar CTO nova). */
  autoOpenTecnicoDialog?: boolean;
};

export function EditCtoForm({
  defaultValues,
  autoOpenTecnicoDialog = false,
}: EditCtoFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [tecnicoDialogOpen, setTecnicoDialogOpen] = useState(false);
  const didAutoOpenTecnico = useRef(false);

  useEffect(() => {
    if (!autoOpenTecnicoDialog || didAutoOpenTecnico.current) return;
    didAutoOpenTecnico.current = true;
    setTecnicoDialogOpen(true);
    router.replace(pathname, { scroll: false });
  }, [autoOpenTecnicoDialog, pathname, router]);

  const form = useForm<EditCtoFormValues>({
    resolver: zodResolver(editCtoFormSchema),
    defaultValues,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const cidade = watch("cidade");
  const semIdentificacao = watch("semIdentificacao");
  const tecnologia = watch("tecnologia") ?? "";
  const prevSemIdent = useRef<boolean | null>(null);

  const didMountCidade = useRef(false);
  useEffect(() => {
    if (!didMountCidade.current) {
      didMountCidade.current = true;
      return;
    }
    if (isCidadeComTecnologiaSp(cidade)) {
      setValue("area_caixa", "");
      setValue("valor_caixa", "");
    } else {
      setValue("tecnologia", "");
      setValue("hw_ct", "");
      setValue("hw_cb", "");
      setValue("hw_cd", "");
      setValue("hw_bk", "");
      setValue("possui_cordoaria", undefined);
    }
    clearErrors("root");
  }, [cidade, setValue, clearErrors]);

  useEffect(() => {
    if (prevSemIdent.current === null) {
      prevSemIdent.current = semIdentificacao;
      return;
    }
    if (semIdentificacao && !prevSemIdent.current) {
      setValue("identificacao_cto", "");
      setValue("tecnologia", "");
      setValue("possui_cordoaria", undefined);
      setValue("hw_ct", "");
      setValue("hw_cb", "");
      setValue("hw_cd", "");
      setValue("hw_bk", "");
      setValue("area_caixa", "");
      setValue("valor_caixa", "");
    }
    prevSemIdent.current = semIdentificacao;
  }, [semIdentificacao, setValue]);

  const { fields, replace } = useFieldArray({
    control,
    name: "portas",
  });

  const capacidade = watch("capacidade");

  const stepLabels = useMemo(
    () => ["Dados da CTO", "Capacidade", "Portas", "Observações"],
    [],
  );

  function syncPortasForNewCapacity(newCap: 8 | 16) {
    const cur = getValues("portas");
    if (newCap === 16 && cur.length === 8) {
      replace([
        ...cur,
        ...Array.from({ length: 8 }, (_, i) => ({
          numero_porta: 9 + i,
          status: PORT_STATUS.LIVRE_SEM_QUEDA,
          contrato: "",
        })),
      ]);
    } else if (newCap === 8 && cur.length === 16) {
      replace(cur.filter((p) => p.numero_porta <= 8));
    }
  }

  async function goToStep2() {
    clearErrors("root");
    const ok = await trigger(
      getNovaCtoStep1TriggerFieldNames(getValues()),
    );
    if (!ok) return;

    const v = getValues();
    const dup = await checkCtoDuplicateAtStep1({
      cidade: v.cidade,
      semIdentificacao: v.semIdentificacao,
      identificacao_cto: v.identificacao_cto,
      tecnologia: v.tecnologia,
      possui_cordoaria: v.possui_cordoaria,
      hw_ct: v.hw_ct,
      hw_cb: v.hw_cb,
      hw_cd: v.hw_cd,
      hw_bk: v.hw_bk,
      area_caixa: v.area_caixa,
      valor_caixa: v.valor_caixa,
      excludeCtoId: v.id,
    });

    if (!dup.ok) {
      if ("message" in dup) {
        setError("root", { type: "duplicate", message: dup.message });
      } else {
        toast.error(dup.error);
      }
      return;
    }

    setStep(2);
  }

  async function goToStep3() {
    setStep(3);
  }

  async function goToStep4() {
    const ok = await trigger(["portas"]);
    if (!ok) return;
    setStep(4);
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
                  <Field data-invalid={!!errors.cidade}>
                    <FieldLabel htmlFor="edit_cidade">
                      Cidade
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </FieldLabel>
                    <Controller
                      name="cidade"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          required
                        >
                          <SelectTrigger
                            id="edit_cidade"
                            className="h-8 w-full max-w-lg"
                            size="default"
                            aria-required
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

                  <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <Controller
                      name="semIdentificacao"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="sem-ident-edit-cto"
                          className="mt-0.5"
                          checked={field.value}
                          onCheckedChange={(c) => field.onChange(!!c)}
                        />
                      )}
                    />
                    <div className="min-w-0">
                      <Label
                        htmlFor="sem-ident-edit-cto"
                        className="text-sm font-medium leading-snug"
                      >
                        CTO sem identificação visual
                      </Label>
                    </div>
                  </div>

                  {!semIdentificacao ? (
                    <CtoStep1IdentificacaoFields
                      control={control as unknown as Control<NovaCtoFormValues>}
                      register={
                        register as unknown as UseFormRegister<NovaCtoFormValues>
                      }
                      errors={errors as unknown as FieldErrors<NovaCtoFormValues>}
                      cidade={cidade}
                      tecnologia={tecnologia}
                      idPrefix="edit"
                    />
                  ) : null}

                  <Field data-invalid={!!errors.tecnico_campo}>
                    <FieldLabel htmlFor="edit_tecnico_campo">
                      Técnico de campo
                    </FieldLabel>
                    <Controller
                      name="tecnico_campo"
                      control={control}
                      render={({ field }) => (
                        <TecnicoCampoCombobox
                          id="edit_tecnico_campo"
                          value={field.value}
                          onChange={field.onChange}
                          invalid={!!errors.tecnico_campo}
                        />
                      )}
                    />
                    <FieldError errors={[errors.tecnico_campo]} />
                  </Field>

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
                </FieldGroup>
              </FieldSet>

              {errors.root?.message && (
                <p className="mt-4 text-destructive text-sm" role="alert">
                  {String(errors.root.message)}
                </p>
              )}

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
                  Altere a capacidade se necessário (8 ou 16 portas)
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
                        onValueChange={(v) => {
                          const newCap = Number(v) as 8 | 16;
                          if (newCap !== field.value) {
                            syncPortasForNewCapacity(newCap);
                          }
                          field.onChange(newCap);
                        }}
                      >
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <RadioGroupItem value="8" id="edit-cap-8" />
                          <span>8 portas</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <RadioGroupItem value="16" id="edit-cap-16" />
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
                      const showContract = portStatusRequiresContract(st);
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
                <FieldLabel htmlFor="edit_observacoes">
                  Observações (opcional)
                </FieldLabel>
                <Textarea
                  id="edit_observacoes"
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
