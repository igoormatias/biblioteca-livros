import { z } from "zod";

const uniqueNumberArray = (min: number) =>
  z
    .array(z.number().int().positive())
    .min(min)
    .refine((ids) => new Set(ids).size === ids.length, "IDs duplicados não são permitidos.");

const baseLivroFields = {
  titulo: z.string().trim().min(1).max(40),
  editora: z.string().trim().min(1).max(40),
  edicao: z.number().int().positive(),
  anoPublicacao: z
    .string()
    .length(4)
    .regex(/^[0-9]{4}$/, "Informe o ano com 4 dígitos."),
  valor: z.number().nonnegative(),
  autorIds: uniqueNumberArray(1),
  assuntoIds: uniqueNumberArray(1),
};

export const createLivroBodySchema = z.object(baseLivroFields);

export const updateLivroBodySchema = z.object(baseLivroFields);

export type CreateLivroBody = z.infer<typeof createLivroBodySchema>;
export type UpdateLivroBody = z.infer<typeof updateLivroBodySchema>;
