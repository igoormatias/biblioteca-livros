import { prisma } from "../../core/prisma.js";

export type RelatorioLivroPorAutorRow = {
  cod_autor: number;
  nome_autor: string;
  cod_livro: number;
  titulo: string;
  editora: string;
  edicao: number;
  ano_publicacao: string;
  valor: unknown;
  assuntos: string;
};

export class RelatorioRepository {
  findLivrosPorAutor() {
    return prisma.$queryRaw<RelatorioLivroPorAutorRow[]>`
      SELECT * FROM vw_relatorio_livros_por_autor
      ORDER BY nome_autor ASC, titulo ASC
    `;
  }
}

export const relatorioRepository = new RelatorioRepository();
