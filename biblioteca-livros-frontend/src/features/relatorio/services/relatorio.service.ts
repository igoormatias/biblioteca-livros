import { http } from "../../../services/http";

import type { RelatorioLivroPorAutorResponse } from "../types";

export const getRelatorioLivrosPorAutor = async (): Promise<RelatorioLivroPorAutorResponse> => {
  const { data } = await http.get("/relatorios/livros-por-autor");
  return data;
};

export const downloadRelatorioLivrosPorAutorCsv = async (): Promise<Blob> => {
  const { data } = await http.get("/relatorios/livros-por-autor/csv", { responseType: "blob" });
  return data;
};

