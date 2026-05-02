import { z } from "zod";

export const createAutorBodySchema = z.object({
  nome: z.string().trim().min(1).max(40),
});

export const updateAutorBodySchema = z.object({
  nome: z.string().trim().min(1).max(40),
});

export type CreateAutorBody = z.infer<typeof createAutorBodySchema>;
export type UpdateAutorBody = z.infer<typeof updateAutorBodySchema>;
