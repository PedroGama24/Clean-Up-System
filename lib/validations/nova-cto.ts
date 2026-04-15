import { z } from "zod";

import {
  CTO_CIDADES,
  isCidadeComTecnologiaSp,
} from "@/lib/constants/cto-cidades";
import {
  PORT_STATUS,
  portStatusRequiresContract,
} from "@/lib/constants/cto";
import { isTecnicoCampo } from "@/lib/constants/tecnico-campo";

const CIDADE_SET = new Set<string>(CTO_CIDADES);

export const CTO_TECNOLOGIAS = ["HW", "FH", "NK"] as const;
export type CtoTecnologia = (typeof CTO_TECNOLOGIAS)[number];

export const PORT_STATUSES = [
  PORT_STATUS.COM_CONTRATO,
  PORT_STATUS.SEM_CONTRATO,
  PORT_STATUS.LIVRE_CANCELADO,
  PORT_STATUS.LIVRE_MUDANCA_ENDERECO,
  PORT_STATUS.LIVRE_SEM_QUEDA,
] as const;

const portRowSchema = z
  .object({
    numero_porta: z.number().int().min(1).max(16),
    status: z.enum(PORT_STATUSES),
    contrato: z.string().optional(),
  })
  .superRefine((row, ctx) => {
    if (portStatusRequiresContract(row.status) && !row.contrato?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número do contrato",
        path: ["contrato"],
      });
    }
  });

const trimOrEmpty = (s: string | undefined) => s?.trim() ?? "";

export const novaCtoFormSchema = z
  .object({
    cidade: z
      .string()
      .min(1, "Selecione a cidade")
      .refine((c) => CIDADE_SET.has(c), "Cidade inválida"),
    identificacao_cto: z.string().max(500),
    tecnologia: z.union([z.enum(CTO_TECNOLOGIAS), z.literal("")]),
    possui_cordoaria: z.boolean().optional(),
    hw_ct: z.string().max(200),
    hw_cb: z.string().max(200),
    hw_cd: z.string().max(200),
    hw_bk: z.string().max(200),
    area_caixa: z.string().max(200),
    valor_caixa: z.string().max(200),
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

    const sp = isCidadeComTecnologiaSp(data.cidade);
    const id = trimOrEmpty(data.identificacao_cto);
    const tec = data.tecnologia ?? "";

    if (sp) {
      if (tec !== "HW" && tec !== "FH" && tec !== "NK") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione a tecnologia",
          path: ["tecnologia"],
        });
        return;
      }
      if (tec === "HW") {
        const parts = ["hw_ct", "hw_cb", "hw_cd", "hw_bk"] as const;
        for (const key of parts) {
          if (!trimOrEmpty(data[key])) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Preencha todos os campos HW",
              path: [key],
            });
          }
        }
        if (data.possui_cordoaria !== true && data.possui_cordoaria !== false) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Indique se possui cordoaria",
            path: ["possui_cordoaria"],
          });
        }
        return;
      }
      if (tec === "NK") {
        if (!id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Informe a identificação da CTO",
            path: ["identificacao_cto"],
          });
        }
        if (data.possui_cordoaria !== true && data.possui_cordoaria !== false) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Indique se possui cordoaria",
            path: ["possui_cordoaria"],
          });
        }
        return;
      }
      if (tec === "FH") {
        if (!id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Informe a identificação da CTO",
            path: ["identificacao_cto"],
          });
        }
        if (data.possui_cordoaria !== true && data.possui_cordoaria !== false) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Indique se possui cordoaria",
            path: ["possui_cordoaria"],
          });
        }
      }
      return;
    }

    if (!trimOrEmpty(data.area_caixa)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe a área da caixa",
        path: ["area_caixa"],
      });
    }
    if (!trimOrEmpty(data.valor_caixa)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o valor da caixa",
        path: ["valor_caixa"],
      });
    }
  });

export type NovaCtoFormValues = z.infer<typeof novaCtoFormSchema>;
