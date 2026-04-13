import { z } from "zod";

import { CTO_CIDADES } from "@/lib/constants/cto-cidades";
import { PORT_STATUS } from "@/lib/constants/cto";
import { isTecnicoCampo } from "@/lib/constants/tecnico-campo";

const CIDADE_SET = new Set<string>(CTO_CIDADES);

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
    cidade: z
      .string()
      .min(1, "Selecione a cidade")
      .refine((c) => CIDADE_SET.has(c), "Cidade inválida"),
    identificacao_cto: z
      .string()
      .min(1, "Informe a identificação da CTO")
      .max(500),
    tecnico_campo: z
      .string()
      .min(1, "Selecione o técnico de campo")
      .refine((s) => isTecnicoCampo(s), "Técnico inválido"),
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
    capacidade: z.union([z.literal(8), z.literal(16)], {
      error: "Selecione a capacidade da caixa (8 ou 16 portas)",
    }),
    observacoes: z.string().max(4000).optional(),
    portas: z.array(portRowSchema),
  })
  .superRefine((data, ctx) => {
    if (data.portas.length !== data.capacidade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Configure exatamente ${data.capacidade} portas`,
        path: ["portas"],
      });
    }
  });

export type NovaCtoFormValues = z.infer<typeof novaCtoFormSchema>;
