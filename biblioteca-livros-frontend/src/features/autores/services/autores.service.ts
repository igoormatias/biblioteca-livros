import { http } from "../../../services/http";
import type { Autor, CreateAutorBody, UpdateAutorBody } from "../types";

export const listAutores = async (): Promise<Autor[]> => {
  const { data } = await http.get("/autores");
  return data;
};

export const getAutor = async (autorId: number): Promise<Autor> => {
  const { data } = await http.get(`/autores/${autorId}`);
  return data;
};

export const createAutor = async (body: CreateAutorBody): Promise<Autor> => {
  const { data } = await http.post("/autores", body);
  return data;
};

export const updateAutor = async (autorId: number, body: UpdateAutorBody): Promise<Autor> => {
  const { data } = await http.put(`/autores/${autorId}`, body);
  return data;
};

export const deleteAutor = async (autorId: number): Promise<void> => {
  await http.delete(`/autores/${autorId}`);
};

