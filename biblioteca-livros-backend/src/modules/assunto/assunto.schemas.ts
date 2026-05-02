import { z } from "zod";

export const createAssuntoBodySchema = z.object({
  descricao: z.string().trim().min(1).max(20),
});

export const updateAssuntoBodySchema = z.object({
  descricao: z.string().trim().min(1).max(20),
});

export type CreateAssuntoBody = z.infer<typeof createAssuntoBodySchema>;
export type UpdateAssuntoBody = z.infer<typeof updateAssuntoBodySchema>;
