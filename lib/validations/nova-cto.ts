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

import {
  MSG_APENAS_LETRAS_NUMEROS,
  MSG_APENAS_LETRAS_NUMEROS_HIFEN_OLT,
  MSG_APENAS_NUMEROS,
} from "@/lib/cto/form-input-sanitize";

const CIDADE_SET = new Set<string>(CTO_CIDADES);

const alnumUpperRegex = /^[A-Z0-9]+$/;
/** OLT permite hífen além de letras e números. */
const oltRegex = /^[A-Z0-9-]+$/;
const digitsOnlyRegex = /^\d+$/;

function hwAlnumField() {
  return z
    .string()
    .max(200)
    .refine(
      (s) => s === "" || alnumUpperRegex.test(s),
      MSG_APENAS_LETRAS_NUMEROS,
    );
}

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
    /** Sempre obrigatório, independente de `semIdentificacao` (não use superRefine para flexibilizar). */
    cidade: z
      .string()
      .min(1, "Obrigatório")
      .refine((c) => CIDADE_SET.has(c), "Cidade inválida"),
    /** Quando true, a validação e a persistência ignoram os campos de identificação. */
    semIdentificacao: z.boolean(),
    identificacao_cto: z.string().max(500),
    tecnologia: z.union([z.enum(CTO_TECNOLOGIAS), z.literal("")]),
    possui_cordoaria: z.boolean().optional(),
    hw_ct: hwAlnumField(),
    hw_cb: hwAlnumField(),
    hw_cd: hwAlnumField(),
    hw_bk: hwAlnumField(),
    area_caixa: z.string().max(200),
    valor_caixa: z.string().max(200),
    tecnico_campo: z
      .string()
      .min(1, "Selecione o técnico de campo")
      .refine((s) => isTecnicoCampo(s), "Técnico inválido"),
    /** Contrato da operação (cabeçalho); apenas dígitos; distinto do contrato por porta em `portas`. */
    contrato: z
      .string()
      .min(1, "Obrigatório")
      .regex(digitsOnlyRegex, MSG_APENAS_NUMEROS),
    olt: z
      .string()
      .min(1, "Obrigatório")
      .regex(oltRegex, MSG_APENAS_LETRAS_NUMEROS_HIFEN_OLT),
    slot: z
      .string()
      .min(1, "Obrigatório")
      .regex(digitsOnlyRegex, MSG_APENAS_NUMEROS),
    pon: z
      .string()
      .min(1, "Obrigatório")
      .regex(digitsOnlyRegex, MSG_APENAS_NUMEROS),
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
  })
  .superRefine((data, ctx) => {
    if (data.semIdentificacao) {
      return;
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
  })
  .superRefine((data, ctx) => {
    if (data.semIdentificacao) {
      return;
    }
    const id = trimOrEmpty(data.identificacao_cto);
    if (id !== "" && !alnumUpperRegex.test(id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MSG_APENAS_LETRAS_NUMEROS,
        path: ["identificacao_cto"],
      });
    }
  });

export type NovaCtoFormValues = z.infer<typeof novaCtoFormSchema>;
