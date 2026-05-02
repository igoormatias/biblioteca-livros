import { http } from "../../../services/http";
import type { CreateLivroBody, Livro, UpdateLivroBody } from "../types";

export const listLivros = async (): Promise<Livro[]> => {
  const { data } = await http.get("/livros");
  return data;
};

export const getLivro = async (livroId: number): Promise<Livro> => {
  const { data } = await http.get(`/livros/${livroId}`);
  return data;
};

export const createLivro = async (body: CreateLivroBody): Promise<Livro> => {
  const { data } = await http.post("/livros", body);
  return data;
};

export const updateLivro = async (livroId: number, body: UpdateLivroBody): Promise<Livro> => {
  const { data } = await http.put(`/livros/${livroId}`, body);
  return data;
};

export const deleteLivro = async (livroId: number): Promise<void> => {
  await http.delete(`/livros/${livroId}`);
};

