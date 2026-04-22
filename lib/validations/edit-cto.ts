import { z } from "zod";

import { novaCtoFormSchema } from "@/lib/validations/nova-cto";

/** Inclui `cidade` obrigatório do `novaCtoFormSchema` (independe de `semIdentificacao`). */
export const editCtoFormSchema = novaCtoFormSchema.and(
  z.object({
    id: z.string().uuid("Identificador da CTO inválido"),
  }),
);

export type EditCtoFormValues = z.infer<typeof editCtoFormSchema>;
