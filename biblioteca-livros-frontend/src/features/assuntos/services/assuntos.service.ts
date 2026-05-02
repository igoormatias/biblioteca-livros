import { http } from "../../../services/http";
import type { Assunto, CreateAssuntoBody, UpdateAssuntoBody } from "../types";

export const listAssuntos = async (): Promise<Assunto[]> => {
  const { data } = await http.get("/assuntos");
  return data;
};

export const getAssunto = async (assuntoId: number): Promise<Assunto> => {
  const { data } = await http.get(`/assuntos/${assuntoId}`);
  return data;
};

export const createAssunto = async (body: CreateAssuntoBody): Promise<Assunto> => {
  const { data } = await http.post("/assuntos", body);
  return data;
};

export const updateAssunto = async (assuntoId: number, body: UpdateAssuntoBody): Promise<Assunto> => {
  const { data } = await http.put(`/assuntos/${assuntoId}`, body);
  return data;
};

export const deleteAssunto = async (assuntoId: number): Promise<void> => {
  await http.delete(`/assuntos/${assuntoId}`);
};

