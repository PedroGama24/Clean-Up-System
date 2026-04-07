import { z } from "zod";

import { PORT_STATUS } from "@/lib/constants/cto";

export const PORT_STATUSES = [
  PORT_STATUS.COM_CONTRATO,
  PORT_STATUS.SEM_CONTRATO,
  PORT_STATUS.LIVRE,
] as const;

const portRowSchema = z
  .object({
    numero_porta: z.number().int().min(1).max(16),
    status: z.enum(PORT_STATUSES),
    contrato: z.string().optional(),
  })
  .superRefine((row, ctx) => {
    if (row.status === PORT_STATUS.COM_CONTRATO && !row.contrato?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número do contrato",
        path: ["contrato"],
      });
    }
  });

export const novaCtoFormSchema = z
  .object({
    nome_cto: z.string().min(1, "Informe o nome da CTO"),
    /** Área conhecida (código BKO) ou fluxo sem área → Primária. */
    areaOrigem: z.enum(["codigo_interno", "sem_area"]),
    /** Código da área digitado pelo BKO (quando areaOrigem === codigo_interno). */
    areaCodigo: z.string().optional(),
    /** Obrigatório se areaOrigem === "sem_area". */
    primariaCodigo: z.string().optional(),
    olt: z.string().optional(),
    slot: z
      .string()
      .optional()
      .refine(
        (s) => s == null || s === "" || /^-?\d+$/.test(s.trim()),
        "Slot deve ser um número inteiro",
      ),
    pon: z
      .string()
      .optional()
      .refine(
        (s) => s == null || s === "" || /^-?\d+$/.test(s.trim()),
        "PON deve ser um número inteiro",
      ),
    potencia_dbm: z
      .string()
      .optional()
      .refine(
        (s) =>
          s == null ||
          s === "" ||
          (Number.isFinite(Number(s)) && !Number.isNaN(Number(s))),
        "Potência inválida",
      ),
    capacidade: z.union([z.literal(8), z.literal(16)], {
      error: "Selecione a capacidade da caixa (8 ou 16 portas)",
    }),
    portas: z.array(portRowSchema),
  })
  .superRefine((data, ctx) => {
    if (data.areaOrigem === "codigo_interno" && !data.areaCodigo?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Digite o código da área",
        path: ["areaCodigo"],
      });
    }
    if (data.areaOrigem === "sem_area") {
      if (!data.primariaCodigo?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o código de referência Primária",
          path: ["primariaCodigo"],
        });
      }
    }
    if (data.portas.length !== data.capacidade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Configure exatamente ${data.capacidade} portas`,
        path: ["portas"],
      });
    }
  });

export type NovaCtoFormValues = z.infer<typeof novaCtoFormSchema>;
