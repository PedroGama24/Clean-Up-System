"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { isCidadeComTecnologiaSp } from "@/lib/constants/cto-cidades";
import { cn } from "@/lib/utils";
import {
  CTO_TECNOLOGIAS,
  type NovaCtoFormValues,
} from "@/lib/validations/nova-cto";

/** Valor interno do Select (nunca conflita com HW/FH/NK); mantém o componente sempre controlado. */
const TECNOLOGIA_SELECT_EMPTY = "__tec_none__";

type CtoStep1IdentificacaoFieldsProps = {
  control: Control<NovaCtoFormValues>;
  register: UseFormRegister<NovaCtoFormValues>;
  errors: FieldErrors<NovaCtoFormValues>;
  cidade: string;
  tecnologia: string;
  /** Prefixo opcional para ids únicos (ex.: edição). */
  idPrefix?: string;
};

export function CtoStep1IdentificacaoFields({
  control,
  register,
  errors,
  cidade,
  tecnologia,
  idPrefix = "",
}: CtoStep1IdentificacaoFieldsProps) {
  const p = idPrefix ? `${idPrefix}_` : "";
  const sp = isCidadeComTecnologiaSp(cidade);

  if (!sp) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.area_caixa}>
            <FieldLabel htmlFor={`${p}area_caixa`}>Área</FieldLabel>
            <Input
              id={`${p}area_caixa`}
              inputMode="decimal"
              autoComplete="off"
              {...register("area_caixa")}
            />
            <FieldError errors={[errors.area_caixa]} />
          </Field>
          <Field data-invalid={!!errors.valor_caixa}>
            <FieldLabel htmlFor={`${p}valor_caixa`}>
              Valor da Caixa
            </FieldLabel>
            <Input
              id={`${p}valor_caixa`}
              inputMode="decimal"
              autoComplete="off"
              {...register("valor_caixa")}
            />
            <FieldError errors={[errors.valor_caixa]} />
          </Field>
        </div>
      </>
    );
  }

  return (
    <>
      <Field data-invalid={!!errors.tecnologia}>
        <FieldLabel htmlFor={`${p}tecnologia`}>Tecnologia</FieldLabel>
        <Controller
          name="tecnologia"
          control={control}
          render={({ field }) => {
            const raw = field.value as string;
            const selectValue =
              raw && raw !== "" ? raw : TECNOLOGIA_SELECT_EMPTY;
            return (
              <Select
                value={selectValue}
                onValueChange={(v) =>
                  field.onChange(
                    v === TECNOLOGIA_SELECT_EMPTY
                      ? ""
                      : (v as (typeof CTO_TECNOLOGIAS)[number]),
                  )
                }
              >
                <SelectTrigger
                  id={`${p}tecnologia`}
                  className="h-8 w-full max-w-lg"
                  size="default"
                >
                  <span
                    data-slot="select-value"
                    className={cn(
                      "line-clamp-1 flex flex-1 text-left",
                      selectValue === TECNOLOGIA_SELECT_EMPTY &&
                        "text-muted-foreground",
                    )}
                  >
                    {selectValue === TECNOLOGIA_SELECT_EMPTY
                      ? "Selecione a tecnologia"
                      : selectValue}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TECNOLOGIA_SELECT_EMPTY}>
                    Selecione a tecnologia
                  </SelectItem>
                  {CTO_TECNOLOGIAS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        <FieldError errors={[errors.tecnologia]} />
      </Field>

      {tecnologia === "HW" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["hw_ct", "CT"],
              ["hw_cb", "CB"],
              ["hw_cd", "CD"],
              ["hw_bk", "BK"],
            ] as const
          ).map(([name, label]) => (
            <Field key={name} data-invalid={!!errors[name]}>
              <FieldLabel htmlFor={`${p}${name}`}>{label}</FieldLabel>
              <Input
                id={`${p}${name}`}
                className="h-8"
                autoComplete="off"
                {...register(name)}
              />
              <FieldError errors={[errors[name]]} />
            </Field>
          ))}
        </div>
      )}

      {tecnologia === "FH" && (
        <Field data-invalid={!!errors.identificacao_cto}>
          <FieldLabel htmlFor={`${p}identificacao_cto`}>
            Identificação CTO
          </FieldLabel>
          <Input
            id={`${p}identificacao_cto`}
            className="max-w-lg"
            autoComplete="off"
            {...register("identificacao_cto")}
          />
          <FieldError errors={[errors.identificacao_cto]} />
        </Field>
      )}

      {tecnologia === "NK" && (
        <>
          <Field data-invalid={!!errors.identificacao_cto}>
            <FieldLabel htmlFor={`${p}identificacao_cto`}>
              Identificação CTO
            </FieldLabel>
            <Input
              id={`${p}identificacao_cto`}
              className="max-w-lg"
              autoComplete="off"
              {...register("identificacao_cto")}
            />
            <FieldError errors={[errors.identificacao_cto]} />
          </Field>

          <Field data-invalid={!!errors.possui_cordoaria}>
            <FieldLegend className="text-sm">Possui cordoaria</FieldLegend>
            <Controller
              name="possui_cordoaria"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  className="flex flex-wrap gap-4"
                  value={
                    field.value === true
                      ? "sim"
                      : field.value === false
                        ? "nao"
                        : undefined
                  }
                  onValueChange={(v) => field.onChange(v === "sim")}
                >
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <RadioGroupItem value="sim" id={`${p}cord-sim`} />
                    <span>Sim</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <RadioGroupItem value="nao" id={`${p}cord-nao`} />
                    <span>Não</span>
                  </label>
                </RadioGroup>
              )}
            />
            <FieldError errors={[errors.possui_cordoaria]} />
          </Field>
        </>
      )}
    </>
  );
}
