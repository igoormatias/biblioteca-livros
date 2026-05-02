import { relatorioRepository } from "./relatorio.repository.js";

export type RelatorioLivroPorAutorItem = {
  codAutor: number;
  nomeAutor: string;
  codLivro: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: number;
  assuntos: string;
};

function rowValorToNumber(valor: unknown): number {
  if (
    typeof valor === "object" &&
    valor !== null &&
    "toNumber" in valor &&
    typeof (valor as { toNumber: () => number }).toNumber === "function"
  ) {
    return (valor as { toNumber: () => number }).toNumber();
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

export class RelatorioService {
  constructor(private readonly repo = relatorioRepository) {}

  async getLivrosPorAutor(): Promise<RelatorioLivroPorAutorItem[]> {
    const rows = await this.repo.findLivrosPorAutor();
    return rows.map((r) => ({
      codAutor: r.cod_autor,
      nomeAutor: r.nome_autor,
      codLivro: r.cod_livro,
      titulo: r.titulo,
      editora: r.editora,
      edicao: r.edicao,
      anoPublicacao: r.ano_publicacao,
      valor: rowValorToNumber(r.valor),
      assuntos: r.assuntos,
    }));
  }
}

export const relatorioService = new RelatorioService();
